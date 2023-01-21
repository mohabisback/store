import { Pool, QueryConfig, QueryResult } from 'pg';
import { ErrAPI, Status } from '../../ErrAPI';
import { dbDriver, dbName, dbResetOrUp } from '../dbState';
import fs from 'fs';
import path from 'path';

let pgClient: Pool;
let clientStarted: boolean = false

const { PG_HOST, PG_AWS_HOST, PG_USER, PG_PASS } = process.env;

let host: string | undefined;
switch (dbDriver) {
  case 'pg_aws':
    host = PG_AWS_HOST;
    break;
  default:
    host = PG_HOST;
    break;
}
const startPgClient = async (): Promise<void> => {
  if (!dbDriver.includes('pg')) return;
  
  if (clientStarted) {
    console.log('pg already connected.');
    return;
  }

  //start client
  pgClient = new Pool({
    database: dbName,
    port: 5432,
    host,
    user: PG_USER,
    password: PG_PASS,
  });

  //adjust database resets and ups
  if (!dbResetOrUp.includes('reset') && !dbResetOrUp.includes('up')) return;

  const databasesFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../database.json')).toString());
  const database = databasesFile[dbDriver];
  const currentDate = database.date;
  const sqlDir = '../../../migrations/sqls';
  const sqlFiles = fs
    .readdirSync(path.resolve(__dirname, sqlDir), { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name);

  let downFiles: string[] = [];
  let upFiles: string[] = [];

  if (dbResetOrUp.includes('reset')) {
    downFiles = sqlFiles
      .filter((f) => {
        const fileDate = parseInt(f.substring(0, 14));
        return f.endsWith('down.sql') && fileDate <= currentDate;
      })
      .reverse();
    upFiles = sqlFiles.filter((f) => f.endsWith('up.sql'));
  } else if (dbResetOrUp.includes('up')) {
    upFiles = sqlFiles.filter((f) => {
      const fileDate = parseInt(f.substring(0, 14));
      return f.endsWith('up.sql') && fileDate > currentDate;
    });
  }
  console.log('downFiles', downFiles);
  console.log('upFiles', upFiles);
  try {
    for (let fileName of downFiles) {
      const fileDate = parseInt(fileName.substring(0, 14));
      const sql = fs.readFileSync(path.resolve(__dirname, sqlDir, fileName)).toString();
      await connRelease(sql, undefined);
      databasesFile[dbDriver].date = fileDate - 1;
      fs.writeFileSync(path.resolve(__dirname, '../../../database.json'), JSON.stringify(databasesFile, null, 2));
    }
    for (let fileName of upFiles) {
      const fileDate = parseInt(fileName.substring(0, 14));
      const sql = fs.readFileSync(path.resolve(__dirname, sqlDir, fileName)).toString();
      await connRelease(sql, undefined);
      databasesFile[dbDriver].date = fileDate; 
      fs.writeFileSync(path.resolve(__dirname, '../../../database.json'), JSON.stringify(databasesFile, null, 2));
    }
    console.log('migrations completed, ' + downFiles.length + ' downFiles, ' + upFiles.length + ' upFiles.');
  } catch (err) {
    console.log('migrations stopped because of err: ', err);
  }
  
  clientStarted = true
};

export const connRelease = async (
  sql: string | QueryConfig,
  values?: any[],
  errMess: string = ``,
): Promise<QueryResult> => {
  try {
    //errors in connection
    const conn = await pgClient.connect();
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
    throw new ErrAPI(Status.BAD_GATEWAY, 'Database Error: ' + err);
  }
};
export default startPgClient;
