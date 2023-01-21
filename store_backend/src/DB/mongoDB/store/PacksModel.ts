import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { TyPack } from '../../../types/store';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName, dbResetOrUp } from '../../dbState';
import { TyRef } from '../../../types/general';

const collName = 'packs';
let coll: Collection;

export default class PacksModel {
  static async injectClient(client: MongoClient) {
    if (coll) {
      return;
    }
    try {
      coll = client.db(dbName).collection(collName);
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Failed coll handle in ${collName} model: ${err}`);
    }
  }

  //Get Count of Documents with specific props
  static async getPacksCount(props: TyPack): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  //Add Pack
  static async AddPack(pack: TyPack): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, pack);
  }

  static async searchPacks(
    search?: string,
    findProps: TyPack = {},
    projProps: TyPack = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyPack[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.search(coll, search, findProps, projProps, limit, page, sort)) as TyPack[];
  }

  static async getManyPacks(props: TyPack, limit?: number, page?: number, sort?: {}): Promise<TyPack[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getMany(coll, props)) as TyPack[];
  }

  static async getPack(findProps: TyPack, projProps?: TyPack, refs?: TyRef[]): Promise<TyPack | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as TyPack | null;
  }

  static async updatePack(findProps: TyPack, updateProps: TyPack): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }
}
