import { TyRef } from '../../../types/general';
import { TyOrderItem } from '../../../types/store';
import { dbResetOrUp } from '../../dbState';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';

const table = 'orderItems';

export default class OrderItemsModel {
  //Get Count of Documents with specific props
  static async getOrderItemsCount(props: TyOrderItem): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  static async AddOrderItems(orderItems: TyOrderItem[]): Promise<number[]> {
    return await CommonModel.AddMany(table, orderItems);
  }

  static async searchOrderItems(
    search?: string,
    findProps: TyOrderItem = {},
    projProps: TyOrderItem = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyOrderItem[]> {
    return (await CommonModel.search(table, search, findProps, projProps, limit, page, sort)) as TyOrderItem[];
  }

  static async getManyOrderItems(props: TyOrderItem, limit?: number, page?: number, sort?: {}): Promise<TyOrderItem[]> {
    return (await CommonModel.getMany(table, props)) as TyOrderItem[];
  }

  static async getOrderItem(
    findProps: TyOrderItem,
    projProps?: TyOrderItem,
    refs?: TyRef[],
  ): Promise<TyOrderItem | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as TyOrderItem | null;
  }

  static async updateOrderItem(findProps: TyOrderItem, updateProps: TyOrderItem): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }

  static async updateSomeOrderItems(findProps: TyOrderItem, updateProps: TyOrderItem): Promise<number> {
    return await CommonModel.updateAll(table, findProps, updateProps);
  }
}
