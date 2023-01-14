import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { Product } from '../../../interfaces/store';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName } from '../../dbState';
import { Facets, Ref } from '../../../interfaces/general';

const collName = 'products';
let coll: Collection;

export default class ProductsModel {
  static async injectClient(client: MongoClient, state: string = '') {
    if(!coll){
      try {
        coll = client.db(dbName).collection(collName);
      } catch (err) {
        throw new ErrAPI(Status.BAD_GATEWAY, `Failed coll handle in ${collName} model: ${err}`);
      }
    }
  }
  //Get Count of Documents with specific props
  static async getProductsCount(props: Product): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  //checks Email already exists then adds product, returns id
  static async AddProduct(product: Product): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, product, { title: product.title });
  }

  static async getAllProducts(search?: string, findProps: Product = {}, projProps: Product = {}, limit?: number, page?: number, sort?: {}, facets?: Facets): Promise<Product[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getAll(coll, search, findProps, projProps, limit, page, sort, facets)) as Product[];
  }

  static async getSomeProducts(props: Product, limit?: number, page?: number, sort?: {}): Promise<Product[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getSome(coll, props, {grams: 0})) as Product[];
  }

  static async getProduct(findProps: Product, projProps?: Product, refs?:Ref[]): Promise<Product | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as Product | null;
  }

  static async updateProduct(findProps: {}, updateProps: {}): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }

  static async incCount(findProps: {}, updateProps: {}): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    //@ts-ignore
    const prop = (Object.keys(updateProps))[0]
    //@ts-ignore
    const inc = updateProps[prop]
    const result = await coll.updateOne(findProps, { '$inc': updateProps });
    return result.acknowledged
  }
}
