import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import util from 'util';
import { Request, EnState } from '../../types/general';
import { Response, NextFunction } from 'express';
import FilesModel from '../../DB/mongoDB/files/FilesModel';
import { checkImageInServer, createThumb, fileNameDimensions } from '../../utils/imageUtils';
import { ErrAPI, ErrAsync, Status } from '../../ErrAPI';

const router = express.Router({ mergeParams: true });

const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    let dest: string = 'src/assets/images/full';
    const images = ['image/png', 'image/jpeg'];
    if (images.indexOf(file.mimetype) === -1) {
      dest = 'src/assets/files';
    }
    cb(null, dest); //it doesn't make a directory if it is not there error happens
  },
  filename: function (req: Request, file, cb) {
    //const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    console.log(file)
    cb(null, file.originalname);
  },
});

const uploadJob = multer({ storage: storage }).single('file')
const upload = util.promisify(uploadJob)

router.route('/uploads/server/:filename').post(
  ErrAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {filename} = req.params
    try{
      await upload(req, res)
      res.status(Status.OK).send({message: 'uploaded', url:'@backend/'+req.file.filename});
    } catch(err) {console.log(err)}
  }),
);

router.route('/uploads/mongo/:filename').post(
  ErrAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {filename} = req.params
    await FilesModel.uploadFileFromRequest(req, res, filename);
  }),
);

//ex: /product1.jpg?width=200&height=200
router.route('/:name').get(
  ErrAsync(async (req: Request, res: Response, next: NextFunction) => {
    const fileName: string = req.params.name;
    let w: string = (req.query.width as string) || (req.query.w as string);
    let h: string = (req.query.height as string) || (req.query.h as string);

    let width = w ? parseInt(w) : undefined;
    let height = h ? parseInt(h) : undefined;

    if (Number.isNaN(width) || Number.isNaN(height)) {
      throw new ErrAPI(Status.BAD_REQUEST, 'Wrong dimensions.');
    }
    if (width || height) {
      if (!width) {
        width = height;
      }
      if (!height) {
        height = width;
      }
    }

    //check image with requested dimensions in server first
    const serverPath = await checkImageInServer(fileName, width, height);
    if (serverPath) {
      return res.status(200).sendFile(serverPath); //return existed image
    }
    //image has dimensions, and not found
    if (width && height) {
      //check if full image found on server
      const fullServerPath = await checkImageInServer(fileName, undefined, undefined);
      if (fullServerPath) {
        //height and width supplied
        const newThumb = await createThumb(fullServerPath, width, height);
        if (newThumb) {
          return res.status(200).sendFile(newThumb); //return created Thumb
        }
      }
    }
    let result = false;

    //get image with dimensions from mongo
    if (width && height) {
      result = await FilesModel.responseImage(fileNameDimensions(fileName, String(width), String(height)), res);
    }

    if (!result) {
      //get original image from mongo then resize it
      result = await FilesModel.responseImage(fileName, res, width, height);
    }

    ////download image from mongo
    //await FilesModel.download(fileName, res, 220, 220)

    //save image to server from mongo
    //await FilesModel.saveToServer(fileName, './src/assets/images/full', 220, 220)
  }),
);

export default router;
