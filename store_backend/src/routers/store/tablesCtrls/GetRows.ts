import { Status } from '../../../ErrAPI';
import { NextFunction, Request, Response } from '../../../types/general';
import { getQueryProps, getQuery } from '../../_functions';

import TablesModel from '../../../DB/mongoDB/store/TablesModel' //mongoDB model
import { TmCategory } from '../../../types/store';
//import TablesModel from '../../../DB/pgDB/store/TablesModel' //pgDB model
// const TablesModel = require(`../../../DB/${
//   process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
// }/store/TablesModel`).default;

//neeeeeed wooooork, not finishedddd
const GetTables = async (req: Request, res: Response, next: NextFunction) => {
  const {tableName} = req.params
  const query = getQuery(req.query, TmCategory);

  const rows = await TablesModel.getManyRows(tableName, query.props, undefined, query.limit, query.page, query.sort)
  for (let row of rows) {
    //remove props editor shouldn't see
  }
  res.status(Status.OK).send({[tableName]:rows, message: 'tables are sent.' });
};
export default GetTables;
