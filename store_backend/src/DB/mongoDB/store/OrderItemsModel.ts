import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { TyOrderItem } from '../../../types/store';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName, dbResetOrUp } from '../../dbState';
import { TyRef } from '../../../types/general';

const collName = 'orderItems';
let coll: Collection;

export default class OrderItemsModel {
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
  static async getOrderItemsCount(props: TyOrderItem): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  static async AddOrderItems(orderItems: TyOrderItem[]): Promise<number[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddMany(coll, orderItems);
  }

  static async searchOrderItems(
    search?: string,
    findProps: TyOrderItem = {},
    projProps: TyOrderItem = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyOrderItem[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.search(coll, search, findProps, projProps, limit, page, sort)) as TyOrderItem[];
  }

  static async getManyOrderItems(props: TyOrderItem, limit?: number, page?: number, sort?: {}): Promise<TyOrderItem[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getMany(coll, props)) as TyOrderItem[];
  }

  static async getOrderItem(
    findProps: TyOrderItem,
    projProps?: TyOrderItem,
    refs?: TyRef[],
  ): Promise<TyOrderItem | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as TyOrderItem | null;
  }

  static async updateOrderItem(findProps: TyOrderItem, updateProps: TyOrderItem): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }

  static async updateSomeOrderItems(findProps: TyOrderItem, updateProps: TyOrderItem): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateAll(coll, findProps, updateProps);
  }
}
