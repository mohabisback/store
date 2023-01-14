import { Ref } from '../../../interfaces/general';
import { OrderItem } from '../../../interfaces/store';
import { dbResetOrUp } from '../../dbState';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';

const table = 'orderItems';

export default class OrderItemsModel {
  //Get Count of Documents with specific props
  static async getOrderItemsCount(props: OrderItem): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  static async AddOrderItems(orderItems: OrderItem[]): Promise<number[]> {
    return await CommonModel.AddMany(table, orderItems);
  }

  static async getAllOrderItems(search?: string, findProps: OrderItem = {}, projProps: OrderItem = {}, limit?: number, page?: number, sort?: {}): Promise<OrderItem[]> {
    return (await CommonModel.getAll(table, search, findProps, projProps, limit, page, sort)) as OrderItem[];
  }

  static async getSomeOrderItems(props: OrderItem, limit?: number, page?: number, sort?: {}): Promise<OrderItem[]> {
    return (await CommonModel.getSome(table, props)) as OrderItem[];
  }
  
  static async getOrderItem(findProps: OrderItem, projProps?: OrderItem, refs?:Ref[]): Promise<OrderItem | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as OrderItem | null;
  }

  static async updateOrderItem(findProps: OrderItem, updateProps: OrderItem): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }

  static async updateSomeOrderItems(findProps: OrderItem, updateProps: OrderItem): Promise<number> {
    return await CommonModel.updateAll(table, findProps, updateProps);
  }
}
