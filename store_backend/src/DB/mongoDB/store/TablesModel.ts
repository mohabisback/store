import { Db, Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { TyCategory } from '../../../types/store';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName, dbResetOrUp } from '../../dbState';
import { TyRef } from '../../../types/general';

let db: Db;

export default class TablesModel {
  static async injectClient(client: MongoClient) {
    if (db) {
      return;
    }
    try {
      db = client.db(dbName)
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Failed coll handle in ${dbName} model: ${err}`);
    }
  }

  //Get Count of Documents with specific props
  static async getRowCount(collName:string, props: TyCategory): Promise<number> {
    let coll: Collection;
    if (!db) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    } else {
      coll = db.collection(collName)
    }
    return await CommonModel.getCount(coll, props);
  }

  //Add Category
  static async AddRow(collName:string, row: any, noRepeat:object): Promise<number> {
    let coll: Collection;
    if (!db) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    } else {
      coll = db.collection(collName)
    }
    return await CommonModel.AddOne(coll, row, noRepeat);
    
  }

  static async searchTable(collName:string, 
    search?: string,
    findProps: TyCategory = {},
    projProps: TyCategory = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyCategory[]> {
    let coll: Collection;
    if (!db) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    } else {
      coll = db.collection(collName)
    }
    return (await CommonModel.search(coll, search, findProps, projProps, limit, page, sort)) as TyCategory[];
  }

  static async getManyRows(collName:string, findProps?: TyCategory, projProps?:{}, limit?: number, page?: number, sort?: {}): Promise<TyCategory[]> {
    let coll: Collection;
    if (!db) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    } else {
      coll = db.collection(collName)
    }
    return (await CommonModel.getMany(coll, findProps, projProps, limit, page, sort)) as TyCategory[];
  }

  static async getRow(collName:string, findProps: TyCategory, projProps?: TyCategory, refs?: TyRef[]): Promise<TyCategory | null> {
    let coll: Collection;
    if (!db) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    } else {
      coll = db.collection(collName)
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as TyCategory | null;
  }

  static async updateRow(collName:string, findProps: TyCategory, updateProps: TyCategory): Promise<boolean> {
    let coll: Collection;
    if (!db) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    } else {
      coll = db.collection(collName)
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }
  static async deleteRow(collName:string, props: {}): Promise<boolean> {
    let coll: Collection;
    if (!db) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    } else {
      coll = db.collection(collName)
    }
    return await CommonModel.deleteOne(coll, props);
  }
}
