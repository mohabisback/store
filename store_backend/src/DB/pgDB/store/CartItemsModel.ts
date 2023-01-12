import { ErrAPI, Status } from '../../../ErrAPI';
import { Ref } from '../../../interfaces/general';
import { CartItem } from '../../../interfaces/store';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';

const table = 'cartItems';

export default class CartItemsModel {
  //Get Count of Documents with specific props
  static async getCartItemsCount(props: CartItem): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  static async AddCartItems(cartItems: CartItem[]): Promise<number[]> {
    return await CommonModel.AddMany(table, cartItems);
  }

  static async getAllCartItems(search?: string, findProps: CartItem = {}, projProps: CartItem = {}, limit?: number, page?: number, sort?: {}): Promise<CartItem[]> {
    return (await CommonModel.getAll(table, search, findProps, projProps, limit, page, sort)) as CartItem[];
  }

  static async getSomeCartItems(findProps: CartItem, projProps: CartItem={}, limit?: number, page?: number, sort?: {}): Promise<CartItem[]> {
    return (await CommonModel.getSome(table, findProps, projProps, limit, page, sort)) as CartItem[];
  }

  static async getCartItem(findProps: CartItem, projProps?: CartItem, refs?:Ref[]): Promise<CartItem | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as CartItem | null;
  }

  static async updateCartItem(findProps: CartItem, updateProps: CartItem): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }

  static async updateSomeCartItems(findProps: CartItem, updateProps: CartItem): Promise<number> {
    return await CommonModel.updateAll(table, findProps, updateProps);
  }

  static async cartItem(cartItem:CartItem):Promise<CartItem[]>{
    const querySql =`
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
  SELECT * from "cartItems" WHERE "user_id" = $1 and product_id <> $2 and "quantity" > 0 ORDER BY "date" ASC`

  const queryValues = [cartItem.user_id, cartItem.product_id,
  cartItem.quantity, cartItem.price, cartItem.discount, "'" + (new Date()).toISOString().slice(0, 19).replace('T', ' ') + "'"]  
  console.log('came here in cartsItems')
  const results = await connRelease(querySql, queryValues, `Can't find ${table} rows.`);
  console.log('cartItem results: ', results.rows)
  if (results) {
    return results.rows;
  } else {
    throw new ErrAPI(Status.BAD_GATEWAY, `Can't find ${table} rows.`);
  }

}
}
