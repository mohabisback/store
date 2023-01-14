import { Collection, MongoClient, UpdateResult } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { Order } from '../../../interfaces/store';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName, dbResetOrUp } from '../../dbState';
import { Ref } from '../../../interfaces/general';

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
  static async getOrdersCount(props: Order): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  //Add Order
  static async AddOrder(order: Order): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, order);
  }

  static async getAllOrders(search?: string, findProps: Order = {}, projProps: Order = {}, limit?: number, page?: number, sort?: {}): Promise<Order[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getAll(coll, search, findProps, projProps, limit, page, sort)) as Order[];
  }

  static async getSomeOrders(props: Order, limit?: number, page?: number, sort?: {}): Promise<Order[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getSome(coll, props)) as Order[];
  }
  
  static async getOrder(findProps: Order, projProps?: Order, refs?:Ref[]): Promise<Order | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as Order | null;
  }

  static async updateOrder(findProps: Order, updateProps: Order): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }
}
