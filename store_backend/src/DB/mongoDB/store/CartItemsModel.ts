import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { CartItem } from '../../../interfaces/store';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName } from '../mongoClient';
import { Ref } from '../../../interfaces/general';

const collName = 'cartItems';
let coll: Collection;

export default class CartItemsModel {
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
  static async getCartItemsCount(props: {}): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  //checks Email already exists then adds cartItem, returns id
  static async AddCartItem(cartItem: CartItem): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, cartItem);
  }

  static async getAllCartItems(search?: string, findProps: CartItem = {}, projProps: CartItem = {}, limit?: number, page?: number, sort?: {}): Promise<CartItem[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getAll(coll, search, findProps, projProps, limit, page, sort)) as CartItem[];
  }

  static async getSomeCartItems(findProps: CartItem, projProps: CartItem={}, limit?: number, page?: number, sort?: {}): Promise<CartItem[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getSome(coll, findProps, projProps, limit, page, sort)) as CartItem[];
  }


  static async getCartItem(findProps: CartItem, projProps?: CartItem, refs?:Ref[]): Promise<CartItem | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as CartItem | null;
  }

  static async updateCartItem(findProps: {}, updateProps: {}): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }

  static async deleteCartItem(props: {}): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.deleteOne(coll, props);
  }

  static async cartItem(cartItem:CartItem):Promise<CartItem[]>{
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    const {user_id, product_id, quantity, price, discount} = cartItem
    const date = new Date()
    let result: any
    try{
      if (quantity){
        
        result = (await coll.findOneAndUpdate(
          {user_id, product_id},
          {$set:{quantity, price, discount, date}},
          {upsert: true, returnDocument: 'after', projection: {_id: 0}})).value
      } else {
        result = await coll.deleteMany({user_id, product_id})
      }
    } catch (err){
      console.log('my error: ', err)
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't update ${coll.collectionName} document.`);
    }
    try{
      const final =(await coll.find({user_id}, { projection: { _id: 0 } }).sort({date:1}).toArray()) as CartItem[] 
      return final;
    } catch (err){ 
      console.log(err)
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't get updated ${coll.collectionName} documents.`);
    }
  }
}
