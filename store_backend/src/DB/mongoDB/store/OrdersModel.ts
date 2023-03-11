import { Collection, MongoClient, UpdateResult } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { TyOrder } from '../../../types/store';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName, dbResetOrUp } from '../../dbState';
import { TyRef } from '../../../types/general';

const collName = 'orders';
let coll: Collection;

export default class OrdersModel {
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
  static async getOrdersCount(props: TyOrder): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  //Add Order
  static async AddOrder(order: TyOrder): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, order);
  }

  static async searchOrders(
    search?: string,
    findProps: TyOrder = {},
    projProps: TyOrder = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyOrder[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.search(coll, search, findProps, projProps, limit, page, sort)) as TyOrder[];
  }

  static async getManyOrders(props: TyOrder, limit?: number, page?: number, sort?: {}): Promise<TyOrder[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getMany(coll, props)) as TyOrder[];
  }

  static async getOrder(findProps: TyOrder, projProps?: TyOrder, refs?: TyRef[]): Promise<TyOrder | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as TyOrder | null;
  }

  static async updateOrder(findProps: TyOrder, updateProps: TyOrder): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }
}
