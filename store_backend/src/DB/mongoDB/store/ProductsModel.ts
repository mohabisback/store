import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { TyProduct } from '../../../types/store';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName } from '../../dbState';
import { TyFacets, TyRef } from '../../../types/general';

const collName = 'products';
let coll: Collection;

export default class ProductsModel {
  static async injectClient(client: MongoClient, state: string = '') {
    if (!coll) {
      try {
        coll = client.db(dbName).collection(collName);
      } catch (err) {
        throw new ErrAPI(Status.BAD_GATEWAY, `Failed coll handle in ${collName} model: ${err}`);
      }
    }
  }
  //Get Count of Documents with specific props
  static async getProductsCount(props: TyProduct): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  //checks Email already exists then adds product, returns id
  static async AddProduct(product: TyProduct): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, product, { title: product.title });
  }

  static async searchProducts(
    search?: string,
    findProps: TyProduct = {},
    projProps: TyProduct = {},
    limit?: number,
    page?: number,
    sort?: {},
    facets?: TyFacets,
  ): Promise<TyProduct[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.search(coll, search, findProps, projProps, limit, page, sort, facets)) as TyProduct[];
  }

  static async getManyProducts(props: TyProduct, limit?: number, page?: number, sort?: {}): Promise<TyProduct[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getMany(coll, props, { grams: 0 })) as TyProduct[];
  }

  static async getProduct(findProps: TyProduct, projProps?: TyProduct, refs?: TyRef[]): Promise<TyProduct | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as TyProduct | null;
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
    const prop = Object.keys(updateProps)[0];
    //@ts-ignore
    const inc = updateProps[prop];
    const result = await coll.updateOne(findProps, { $inc: updateProps });
    return result.acknowledged;
  }
}
