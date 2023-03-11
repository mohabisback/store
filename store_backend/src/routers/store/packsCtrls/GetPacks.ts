import { Status } from '../../../ErrAPI';
import { NextFunction, Request, Response } from '../../../types/general';
import { TmPack } from '../../../types/store';
import { getQueryProps, getQuery } from '../../_functions';

//import PacksModel from '../../../DB/mongoDB/store/PacksModel' //mongoDB model
//import PacksModel from '../../../DB/pgDB/store/PacksModel' //pgDB model
const PacksModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/PacksModel`).default;

const GetPacks = async (req: Request, res: Response, next: NextFunction) => {
  const query = getQuery(req.query, TmPack);

  const packs = await PacksModel.searchPacks(query.search, query.props, query.limit, query.page, query.sort);

  for (let pack of packs) {
    //remove props editor shouldn't see
  }
  res.status(Status.OK).send({ packs });
};
export default GetPacks;
