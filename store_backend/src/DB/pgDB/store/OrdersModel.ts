import { ErrAPI, Status } from '../../../ErrAPI';
import { Order } from '../../../interfaces/store';
import { connRelease } from '../pgClient';
import { sqlUpdate } from '../sqlFactory';
import CommonModel from '../CommonModel';
import { Ref } from '../../../interfaces/general';
import { dbResetOrUp } from '../../dbState';

const table = 'orders';

export default class OrdersModel {
  //Get Count of Documents with specific props
  static async getOrdersCount(props: Order): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  //Add Order
  static async AddOrder(order: Order): Promise<number> {
    return await CommonModel.AddOne(table, order);
  }

  static async getAllOrders(search?: string, findProps: Order = {}, projProps: Order = {}, limit?: number, page?: number, sort?: {}): Promise<Order[]> {
    return (await CommonModel.getAll(table, search, findProps, projProps, limit, page, sort)) as Order[];
  }

  static async getSomeOrders(props: Order, limit?: number, page?: number, sort?: {}): Promise<Order[]> {
    return (await CommonModel.getSome(table, props)) as Order[];
  }

  static async getOrder(findProps: Order, projProps?: Order, refs?:Ref[]): Promise<Order | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as Order | null;
  }

  static async updateOrder(findProps: Order, updateProps: Order): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }

}
