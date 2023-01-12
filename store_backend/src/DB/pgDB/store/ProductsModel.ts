import { Facets, Ref } from '../../../interfaces/general';
import { Product } from '../../../interfaces/store';
import CommonModel from '../CommonModel';

const table = 'products';

export default class ProductsModel {
  //Get Count of Documents with specific props
  static async getProductsCount(props: Product): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  //checks Email already exists then adds product, returns id
  static async AddProduct(product: Product): Promise<number> {
    return await CommonModel.AddOne(table, product, { title: product.title });
  }

  static async getAllProducts(search?: string, findProps: Product = {}, projProps: Product = {}, limit?: number, page?: number, sort?: {}, facets?: Facets): Promise<Product[]> {
    return (await CommonModel.getAll(table, search, findProps, projProps, limit, page, sort, facets)) as Product[];
  }

  static async getSomeProducts(props: Product, limit?: number, page?: number, sort?: {}): Promise<Product[]> {
    return (await CommonModel.getSome(table, props)) as Product[];
  }

  static async getProduct(findProps: Product, projProps?: Product, refs?:Ref[]): Promise<Product | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as Product | null;
  }

  static async updateProduct(findProps: {}, updateProps: {}): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }

  static async incCount(findProps: {}, updateProps: {}): Promise<boolean> {
    //@ts-ignore
    const prop = (Object.keys(updateProps))[0]
    //@ts-ignore
    const inc = updateProps[prop]
    return await CommonModel.updateOne(table, findProps, `"${prop}" = "${prop}" + ${inc}`);
  }
}
