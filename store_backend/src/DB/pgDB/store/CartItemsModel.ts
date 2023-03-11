import { ErrAPI, Status } from '../../../ErrAPI';
import { TyRef } from '../../../types/general';
import { TyCartItem } from '../../../types/store';
import { dbResetOrUp } from '../../dbState';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';

const table = 'cartItems';

export default class CartItemsModel {
  //Get Count of Documents with specific props
  static async getCartItemsCount(props: TyCartItem): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  static async AddCartItems(cartItems: TyCartItem[]): Promise<number[]> {
    return await CommonModel.AddMany(table, cartItems);
  }

  static async searchCartItems(
    search?: string,
    findProps: TyCartItem = {},
    projProps: TyCartItem = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyCartItem[]> {
    return (await CommonModel.search(table, search, findProps, projProps, limit, page, sort)) as TyCartItem[];
  }

  static async getManyCartItems(
    findProps: TyCartItem,
    projProps: TyCartItem = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyCartItem[]> {
    return (await CommonModel.getMany(table, findProps, projProps, limit, page, sort)) as TyCartItem[];
  }

  static async getCartItem(findProps: TyCartItem, projProps?: TyCartItem, refs?: TyRef[]): Promise<TyCartItem | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as TyCartItem | null;
  }

  static async updateCartItem(findProps: TyCartItem, updateProps: TyCartItem): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }

  static async updateSomeCartItems(findProps: TyCartItem, updateProps: TyCartItem): Promise<number> {
    return await CommonModel.updateAll(table, findProps, updateProps);
  }

  static async cartItem(cartItem: TyCartItem): Promise<TyCartItem[]> {
    const querySql = `
  WITH
  --update cartItem if it exists
  upd AS ( UPDATE "cartItems" SET "quantity" = $3, "date" = $6 WHERE "user_id" = $1 and "product_id"= $2 RETURNING *)
  --insert cartItem if not updated
  , ins as (INSERT INTO "cartItems"
    SELECT 0 as "id", $1 as "user_id", $2 as "product_id", $3 as "quantity", $4 as "price", $5 as "discount", $6 as "date"
    WHERE NOT EXISTS (select * from upd) returning *)
  --delete quantity zero
  , del AS (DELETE FROM "cartItems" WHERE EXISTS (select * from upd WHERE quantity < 1)AND "user_id" = 1)
  --return all cart items for the user
  SELECT * from upd WHERE "quantity" > 0
  UNION
  SELECT * from ins WHERE "quantity" > 0
  UNION
  SELECT * from "cartItems" WHERE "user_id" = $1 and product_id <> $2 and "quantity" > 0 ORDER BY "date" ASC`;

    const queryValues = [
      cartItem.user_id,
      cartItem.product_id,
      cartItem.quantity,
      cartItem.price,
      cartItem.discount,
      "'" + new Date().toISOString().slice(0, 19).replace('T', ' ') + "'",
    ];
    const results = await connRelease(querySql, queryValues, `Can't find ${table} rows.`);
    if (results) {
      return results.rows;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't find ${table} rows.`);
    }
  }
}
