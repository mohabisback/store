import { Request, Response, NextFunction } from '../../../types/general';
import { ErrAPI, Status } from '../../../ErrAPI';

import TablesModel from '../../../DB/mongoDB/store/TablesModel' //mongoDB model
//import TablesModel from '../../../DB/pgDB/store/TablesModel' //pgDB model
// const TablesModel = require(`../../../DB/${
//   process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
// }/store/TablesModel`).default;

const GetRow = async (req: Request, res: Response, next: NextFunction) => {
  const {tableName} = req.params
  const props = req.body
  if (typeof props !== 'object' || Object.keys(props).length === 0){
    throw new ErrAPI(Status.BAD_REQUEST, `Missing props of ${tableName}, nothing to get.`);
  }
  const row = await TablesModel.getRow(tableName, props)
  if(row) {
    res.status(Status.OK).send({row, message: 'Row is found.'});
  } else {
    res.status(Status.NOT_FOUND).send({message: 'Row was not found.'});
  }
};
export default GetRow;
