import { Status, ErrAPI } from '../../ErrAPI';
import { Facets, Ref } from '../../interfaces/general';
import { connRelease } from './pgClient';
import { sqlCount, sqlDelete, sqlInsert, sqlSelect, sqlSelectOne, sqlSelectSome, sqlUpdate } from './sqlFactory';

export default class CommonModel {
  //Get Count of Documents with specific props
  static async getCount(table: string, props: {}): Promise<number> {
    const query = sqlCount(table, props)
    const result = await connRelease(query.sql, query.values, `Can't count ${table} rows`);
    return parseInt(result.rows[0].count);
  }

  //optionally checks props already exists then adds a document, returns id
  static async AddOne(table: string, doc: any, checkDuplicationProps?: {}): Promise<number> {
    //if props supplied and already exists, throw error
    if (checkDuplicationProps) {
      const checkDuple = await this.getCount(table, checkDuplicationProps);
      if (checkDuple) {
        throw new ErrAPI(Status.CONFLICT, `Duplicate ${table} row.`);
      }
    }
    const query = sqlInsert(table, [doc])
    const result = await connRelease(query.sql, query.values, `can't insert ${table} row`);
    if (result.rowCount) {
      return result.rows[0].id;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `${table} row insertion failed.`);
    }
  }

  //adds documents, returns ids
  static async AddMany(table: string, props: any[]): Promise<number[]> {
    const query = sqlInsert(table, props)
    const result = await connRelease(query.sql, query.values, `can't insert ${table} rows`);
    if (result.rows) {
      return result.rows.map((row) => row.id);
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `${table} row insertion failed.`);
    }
  }

  static async updateOne(table: string, findProps: {}, updateProps: {}): Promise<boolean> {
    const query = sqlUpdate(table, findProps, updateProps, 1)
    const result = await connRelease(query.sql, query.values, `Can't update ${table} row.`);
    if (result.rowCount) {
      return true;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't update ${table} row.`);
    }
  }

  static async updateAll(table: string, findProps: {}, updateProps: {}): Promise<number> {
    const query = sqlUpdate(table, findProps, updateProps)
    const result = await connRelease(query.sql, query.values, `Can't update ${table} row.`);
    if (result.rowCount) {
      return 1;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't update ${table} row.`);
    }
  }

  static async deleteOne(table: string, props: {}): Promise<boolean> {
    const query = sqlDelete(table, props, 1)
    const result = await connRelease(query.sql, query.values, `Can't delete ${table} row.`);
    if (result.rowCount) {
      return true;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't delete ${table} row.`);
    }
  }

  static async getOne(table: string, findProps: {}, projProps?:{}, refs?:Ref[]): Promise<Document | null> {
    const query = sqlSelectOne(table, findProps, projProps, refs)
    const result = await connRelease(query.sql, query.values, `Can't find ${table} row.`);
    if (result.rows) {
      return result.rows[0];
    } else {
      return null;
    }
  }
  
  static async getSome(table: string, findProps = {}, projProps = {}, limit?: number, page?: number, sort?: {},): Promise<Document[]> {
    limit = limit ? limit : 30;
    page = page ? page - 1 : 0;
    sort = sort ? sort : { id: -1 };
    const skip = limit * page
    const query = sqlSelectSome(table, findProps, projProps, limit, page, skip)
    const results = await connRelease(query.sql, query.values, `Can't find ${table} rows.`);
    if (results) {
      return results.rows;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't find ${table} rows.`);
    }
  }

  //get all docs, with conditions
  // 1 based pages, default limit = 100
  // sorting example {{email: 1}, {title: -1}} // 1=ascending, -1=descending
  //default is newest docs first
  static async getAll(table: string,  search = '', findProps = {}, projProps = {}, limit?: number, page?: number, sort?: {}, facets?:Facets): Promise<Document[]> {
    limit = limit ? limit : 30;
    page = page ? page - 1 : 0;
    sort = sort ? sort : { id: -1 };
    const skip = limit * page
    const query = sqlSelect(table, search, findProps, projProps, limit, skip, sort, facets)
    const results = await connRelease(query.sql, query.values, `Can't find ${table} rows.`);
    if (results) {
      return results.rows[0];
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't get any ${table} row.`);
    }
  }
}
