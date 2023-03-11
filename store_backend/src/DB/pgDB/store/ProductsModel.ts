import { TyFacets, TyRef } from '../../../types/general';
import { TyProduct } from '../../../types/store';
import { dbResetOrUp } from '../../dbState';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';

const table = 'products';

export default class ProductsModel {
  //Get Count of Documents with specific props
  static async getProductsCount(props: TyProduct): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  //checks Email already exists then adds product, returns id
  static async AddProduct(product: TyProduct): Promise<number> {
    return await CommonModel.AddOne(table, product, { title: product.title });
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
    return (await CommonModel.search(table, search, findProps, projProps, limit, page, sort, facets)) as TyProduct[];
  }

  static async getManyProducts(props: TyProduct, limit?: number, page?: number, sort?: {}): Promise<TyProduct[]> {
    return (await CommonModel.getMany(table, props)) as TyProduct[];
  }

  static async getProduct(findProps: TyProduct, projProps?: TyProduct, refs?: TyRef[]): Promise<TyProduct | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as TyProduct | null;
  }

  static async updateProduct(findProps: {}, updateProps: {}): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }

  static async incCount(findProps: {}, updateProps: {}): Promise<boolean> {
    //@ts-ignore
    const prop = Object.keys(updateProps)[0];
    //@ts-ignore
    const inc = updateProps[prop];
    return await CommonModel.updateOne(table, findProps, `"${prop}" = "${prop}" + ${inc}`);
  }
}
