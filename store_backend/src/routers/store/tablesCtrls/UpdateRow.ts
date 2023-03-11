import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { cleanRow } from './_functions';
import { cleanObject } from '../../_functions';

import TablesModel from '../../../DB/mongoDB/store/TablesModel' //mongoDB model
//import TablesModel from '../../../DB/pgDB/store/TablesModel' //pgDB model
// const TablesModel = require(`../../../DB/${
//   process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
// }/store/TablesModel`).default;
import schemas from '../../../types/schemas';

const UpdateRow = async (req: Request, res: Response, next: NextFunction) => {
  const {tableName, id} = req.params
  const props = req.body
  const idNum = parseFloat(id);
  if(!id || Number.isNaN(idNum) || !Number.isInteger(idNum)){
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing or Wrong-typed id number');
  }
  if (!props) throw new ErrAPI(Status.BAD_REQUEST, `Missing props of ${tableName}, nothing to update.`);
  
  //@ts-ignore
  const rowSchema = schemas[tableName]
  if(!rowSchema) throw new ErrAPI(Status.METHOD_NOT_ALLOWED, `No Schema for ${tableName}, can't add.`);
  const {cleanedRow, noRepeat}  = cleanRow(props, rowSchema, false, false)

  for (let entry of Object.entries(noRepeat)){
    const count = await TablesModel.getRowCount(tableName, {[entry[0]]:entry[1]})
    if (count > 0) throw new ErrAPI(Status.BAD_REQUEST, `Prop "${entry[0]}", already exists with value: "${entry[1]}" in another row, and noRepeat is on.`);
  }
  if(Object.keys(cleanedRow).length === 0){
    throw new ErrAPI(Status.METHOD_NOT_ALLOWED, `Wrong props of ${tableName}, nothing to update.`);
  }

  //update
  let result = await TablesModel.updateRow(tableName, { id: idNum }, cleanedRow);
  if(result){
    let rows = await TablesModel.getManyRows(tableName)
    res.status(Status.OK).send({ id: cleanedRow.id, [tableName]:rows, message: `${tableName} row was updated.`});
  } else {
    res.status(Status.BAD_GATEWAY).send({ message: `${tableName} row was not updated.`});
  }
};

export default UpdateRow;
