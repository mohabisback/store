import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { cleanObject, gramIt } from '../../_functions';
import { cleanRow } from './_functions';

import TablesModel from '../../../DB/mongoDB/store/TablesModel' //mongoDB model
//import TablesModel from '../../../DB/pgDB/TablesModel' //pgDB model
// const TablesModel = require(`../../../DB/${
//   process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
// }/TablesModel`).default;
import schemas from '../../../types/schemas';
  
const AddRow = async (req: Request, res: Response, next: NextFunction) => {
  const {tableName} = req.params
  let row = req.body;
  console.log('row: ', row)
  if (!row) throw new ErrAPI(Status.BAD_REQUEST, `Missing row of ${tableName}, nothing to add.`);

  //@ts-ignore
  const rowSchema = schemas[tableName]
  if(!rowSchema) throw new ErrAPI(Status.METHOD_NOT_ALLOWED, `No Schema for ${tableName}, can't add.`);
  const {cleanedRow, noRepeat}  = cleanRow(row, rowSchema, true, false)
  
  for (let entry of Object.entries(noRepeat)){
    const count = await TablesModel.getRowCount(tableName, {[entry[0]]:entry[1]})
    if (count > 0) throw new ErrAPI(Status.BAD_REQUEST, `Prop "${entry[0]}", already exists with value: "${entry[1]}" in another row, and noRepeat is on.`);
  }
  if(Object.keys(cleanedRow).length === 0){
    throw new ErrAPI(Status.METHOD_NOT_ALLOWED, `Wrong props of ${tableName}, nothing to add.`);
  }

  cleanedRow.id = await TablesModel.AddRow(tableName, cleanedRow, noRepeat);
  
  if (cleanedRow.id) {
    let rows = await TablesModel.getManyRows(tableName)
    res.status(Status.CREATED).send({ id: cleanedRow.id, [tableName]:rows, message: `New value of ${tableName} added.`});
  } else {
    res.status(Status.BAD_GATEWAY).send({ message: `${tableName} row was not added.`});
  }
};

export default AddRow;
