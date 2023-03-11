import { ErrAPI, Status } from '../../../ErrAPI';
import { TyOrder } from '../../../types/store';
import { connRelease } from '../pgClient';
import { sqlUpdate } from '../sqlFactory';
import CommonModel from '../CommonModel';
import { TyRef } from '../../../types/general';
import { dbResetOrUp } from '../../dbState';

const table = 'orders';

export default class OrdersModel {
  //Get Count of Documents with specific props
  static async getOrdersCount(props: TyOrder): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  //Add Order
  static async AddOrder(order: TyOrder): Promise<number> {
    return await CommonModel.AddOne(table, order);
  }

  static async searchOrders(
    search?: string,
    findProps: TyOrder = {},
    projProps: TyOrder = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyOrder[]> {
    return (await CommonModel.search(table, search, findProps, projProps, limit, page, sort)) as TyOrder[];
  }

  static async getManyOrders(props: TyOrder, limit?: number, page?: number, sort?: {}): Promise<TyOrder[]> {
    return (await CommonModel.getMany(table, props)) as TyOrder[];
  }

  static async getOrder(findProps: TyOrder, projProps?: TyOrder, refs?: TyRef[]): Promise<TyOrder | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as TyOrder | null;
  }

  static async updateOrder(findProps: TyOrder, updateProps: TyOrder): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }
}
