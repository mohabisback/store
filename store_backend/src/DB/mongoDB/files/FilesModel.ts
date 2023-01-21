import fs, { WriteStream } from 'fs';
import * as StreamPromises from 'stream/promises';
import sharp, { Sharp } from 'sharp';
import util from 'util';
import multer from 'multer';

import { Db, MongoClient, GridFSBucket } from 'mongodb';
import { Request, Response } from '../../../types/general';

import { DbTypes, GridFsStorage, UrlStorageOptions } from 'multer-gridfs-storage'; //library for uploading files to DBModel
import { Status, ErrAPI } from '../../../ErrAPI';
import path from 'path';
import { cloneThumb, fileNameDimensions } from '../../../utils/imageUtils';
import { pipeline, Readable, Stream } from 'stream';
export const dbName = process.env.ENV?.includes('test') ? 'files_test' : 'files';

let db: Db;

export default class FilesModel {
  //injecting database
  static async injectClient(client: MongoClient) {
    if (db) {
      return;
    }
    try {
      db = client.db(dbName);
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Failed db handle in ${dbName} model: ${err}`);
    }
  }

  
  static async uploadFileFromRequest(req: Request, res: Response) {
    try {
      const storage = new GridFsStorage({
        db: db as unknown as DbTypes,
        file: (req: Request, file) => {
          const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname;

          const match = ['image/png', 'image/jpeg', 'image/jpg'];
          if (match.indexOf(file.mimetype) === -1) {
            return { filename, bucketName: 'files' };
          }
          return { filename, bucketName: 'images' };
        },
      });
      //upload job: multer({ storage: storage }).single('file')
      //upload: promisified upload job
      const uploadJob = multer({ storage: storage }).single('file');
      const upload = util.promisify(uploadJob);
      await upload(req, res);
      if (req.file == undefined) {
        res.send('No file to upload');
      }
      res.send({ ...req.file, name: req.file.filename, type: req.file.contentType });
    } catch (err) {
      res.send(`Error while uploading: ${err}`);
    }
  }
  static async uploadFileFromStream(pipeline: sharp.Sharp, filename: string, contentType: string) {
    try {
      const storage = new GridFsStorage({
        db: db as unknown as DbTypes,
        file: () => {
          let bucketName = 'files';
          if (contentType.includes('image')) {
            bucketName = 'images';
          }
          return { filename, contentType, bucketName };
        },
      });
      const req: Request | undefined = undefined;
      storage.fromStream(pipeline.clone(), req as unknown as Request, undefined).then(() => {});
    } catch (err) {
      console.log('error: ', err);
    }
  }

  static async uploadFileFromServer(filePath: string, newName: string, contentType: string): Promise<boolean> {
    try {
      //if the file found with the right extension, return
      if (!fs.existsSync(filePath)) {
        return false;
      }
      const bucket = new GridFSBucket(db, {
        bucketName: 'images',
      });
      const fileStream = fs.createReadStream(filePath);
      const uploadStream = bucket.openUploadStream(newName, { contentType });
      await util.promisify(Stream.pipeline)(fileStream, uploadStream);
      return true;
    } catch (err) {
      console.log('uploadFileFromFile: error', err);
      return false;
    }
  }
  //download directly, optional width and height for resizing before download
  static async downloadToClient(name: string = '', res: Response, width?: number, height?: number): Promise<void> {
    try {
      const bucket = new GridFSBucket(db, {
        bucketName: 'images',
      });
      let downloadStream = bucket.openDownloadStreamByName(name);

      //for direct download
      res.set('Content-Disposition', 'attachment');

      let pipeline: Sharp | Response;
      if (width) {
        //if there is width, then resize then complete downloading to response
        pipeline = sharp();
        pipeline.resize(width, height ? height : width, { fit: 'inside' }).pipe(res);
      } else {
        pipeline = res;
      }
      downloadStream.pipe(pipeline);
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't download`);
    }
  }

  static async downloadToServer(name: string = '', absoluteDir: string, width?: number, height?: number): Promise<void> {
    try {
      const bucket = new GridFSBucket(db, {
        bucketName: 'images',
      });

      //for writing in server, absolute path
      let downloadStream = bucket.openDownloadStreamByName(name);
      const fsPipeline = fs.createWriteStream(`${absoluteDir}/${name}`);
      let pipeline: Sharp | WriteStream;
      if (width) {
        pipeline = sharp();
        pipeline.resize(width, height ? height : width, { fit: 'inside' }).pipe(fsPipeline);
      } else {
        pipeline = fsPipeline;
      }
      downloadStream.pipe(pipeline);
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't download`);
    }
  }

  //response send image file, optional width and height for resizing before sending file
  static async responseImage(filename: string = '', res: Response, width?: number, height?: number): Promise<boolean> {
    try {
      const bucket = new GridFSBucket(db, { bucketName: 'images' });
      const foundFiles = await bucket.find({ filename }).toArray();
      if (!foundFiles.length) {
        return false;
      }

      let downloadStream = bucket.openDownloadStreamByName(filename);
      downloadStream.on('error', (err) => {
        console.log('gridFsBucket download err: ', err);
      });

      const imageType: string = path.extname(filename).substring(1);
      //for sending the image as image file
      res.writeHead(200, { 'Content-Type': `image/${imageType}` });
      //for response stream error handling
      res.on('error', (err) => {
        console.log('res download err: ', err);
      });

      let pipeline: Sharp | Response;
      if (width) {
        pipeline = sharp();
        pipeline.on('error', (err) => {
          console.log('sharp download err: ', err);
        });
        pipeline.resize(width, height ? height : width, { fit: 'inside' }).pipe(res);

        cloneThumb(pipeline, fileNameDimensions(filename, String(width), String(height)));
        this.uploadFileFromStream(
          pipeline,
          fileNameDimensions(filename, String(width), String(height)),
          foundFiles[0].contentType || '',
        );
      } else {
        pipeline = res;
      }
      downloadStream.pipe(pipeline);
    } catch (err) {
      console.log('response image error: ', err);
    }
    return true; //true doesn't mean the file is sent, but it means it is found, may be streaming
  }

}
