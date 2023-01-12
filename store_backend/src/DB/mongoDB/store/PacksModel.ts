import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { Pack } from '../../../interfaces/store';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName } from '../mongoClient';
import { Ref } from '../../../interfaces/general';

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
  static async getPacksCount(props: Pack): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  //Add Pack
  static async AddPack(pack: Pack): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, pack);
  }

  static async getAllPacks(search?: string, findProps: Pack = {}, projProps: Pack = {}, limit?: number, page?: number, sort?: {}): Promise<Pack[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getAll(coll, search, findProps, projProps, limit, page, sort)) as Pack[];
  }

  static async getSomePacks(props: Pack, limit?: number, page?: number, sort?: {}): Promise<Pack[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getSome(coll, props)) as Pack[];
  }

  static async getPack(findProps: Pack, projProps?: Pack, refs?:Ref[]): Promise<Pack | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as Pack | null;
  }

  static async updatePack(findProps: Pack, updateProps: Pack): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }
}
