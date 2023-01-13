import { Pool, QueryConfig, QueryResult } from 'pg';
import { ErrAPI, Status } from '../../ErrAPI';

const { ENV, PG_HOST, PG_AWS_HOST, PG_PORT, PG_DB, PG_TEST_DB, PG_USER, PG_PASS } = process.env;

let database: string | undefined;
switch (ENV?.includes('test')) {
  case true:
    database = PG_TEST_DB;
    break;
  default:
    database = PG_DB;
    break;
}
let host: string | undefined;
switch (ENV?.includes('aws')) {
  case true:
    host = PG_AWS_HOST;
    break;
  default:
    host = PG_HOST;
    break;
}
const client = new Pool({
  database,
  host,
  port: parseInt(PG_PORT as string),
  user: PG_USER,
  password: PG_PASS,
});

export const connRelease = async (sql: string | QueryConfig, values: any[], errMess: string): Promise<QueryResult> => {
  try {
    //errors in connection
    const conn = await client.connect();
    try {
      //errors in query
      const result = await conn.query(sql, values);
      conn.release();
      return result;
    } catch (err) {
      console.log(err);
      conn.release();
      throw new Error();
    }
  } catch (err) {
    throw new ErrAPI(Status.BAD_GATEWAY, 'Database Error, ' + (errMess ? errMess : `can't connect`));
  }
};
export default client;
