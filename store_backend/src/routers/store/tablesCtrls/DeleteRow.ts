import { Request, Response, NextFunction } from '../../../types/general';
import { ErrAPI, Status } from '../../../ErrAPI';

import TablesModel from '../../../DB/mongoDB/store/TablesModel' //mongoDB model
//import TablesModel from '../../../DB/pgDB/store/TablesModel' //pgDB model
// const TablesModel = require(`../../../DB/${
//   process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
// }/store/TablesModel`).default;

const DeleteRow = async (req: Request, res: Response, next: NextFunction) => {
  const {tableName, id} = req.params
  const confirmationProps = req.body
  const idNum = parseFloat(id);
  if(!id || Number.isNaN(idNum) || !Number.isInteger(idNum)){
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing or Wrong-typed id number');
  }
  let obj = {id:idNum}
  if (confirmationProps && typeof confirmationProps === 'object') {
    obj = {...obj, ...confirmationProps}
  }
  const result = await TablesModel.deleteRow(tableName, obj)
  
  if(result){
    let rows = await TablesModel.getManyRows(tableName)
    res.status(Status.CREATED).send({ [tableName]:rows, message: `${tableName} row was deleted.`});
  } else {
    res.status(Status.BAD_GATEWAY).send({ message: `${tableName} row was not deleted.`});
  }
};
export default DeleteRow;
