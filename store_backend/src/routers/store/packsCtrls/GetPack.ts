import { Request, Response, NextFunction } from '../../../types/general';
import { ErrAPI, Status } from '../../../ErrAPI';
import { TyPack } from '../../../types/store';

//import PacksModel from '../../../DB/mongoDB/store/PacksModel' //mongoDB model
//import PacksModel from '../../../DB/pgDB/store/PacksModel' //pgDB model
const PacksModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/PacksModel`).default;

const GetPack = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const idNum = parseInt(id);
  //get pack from database
  let pack: TyPack | null;
  if (Number.isInteger(idNum)) {
    pack = await PacksModel.getPack({ id: idNum });
  } else {
    throw new ErrAPI(Status.UNAUTHORIZED, 'Missing info.');
  }

  res.status(Status.OK).send({pack, message: 'pack is sent'});
};
export default GetPack;
