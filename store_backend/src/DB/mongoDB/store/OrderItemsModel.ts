import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { OrderItem } from '../../../interfaces/store';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName, dbResetOrUp } from '../../dbState';
import { Ref } from '../../../interfaces/general';

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
  static async getOrderItemsCount(props: OrderItem): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  static async AddOrderItems(orderItems: OrderItem[]): Promise<number[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddMany(coll, orderItems);
  }

  static async getAllOrderItems(search?: string, findProps: OrderItem = {}, projProps: OrderItem = {}, limit?: number, page?: number, sort?: {}): Promise<OrderItem[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getAll(coll, search, findProps, projProps, limit, page, sort)) as OrderItem[];
  }

  static async getSomeOrderItems(props: OrderItem, limit?: number, page?: number, sort?: {}): Promise<OrderItem[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getSome(coll, props)) as OrderItem[];
  }

  static async getOrderItem(findProps: OrderItem, projProps?: OrderItem, refs?:Ref[]): Promise<OrderItem | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as OrderItem | null;
  }

  static async updateOrderItem(findProps: OrderItem, updateProps: OrderItem): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }

  static async updateSomeOrderItems(findProps: OrderItem, updateProps: OrderItem): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateAll(coll, findProps, updateProps);
  }
}
