import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { TyCategory } from '../../../types/store';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName, dbResetOrUp } from '../../dbState';
import { TyRef } from '../../../types/general';

const collName = 'categories';
let coll: Collection;

export default class CategoriesModel {
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
  static async getCategoriesCount(props: TyCategory): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  //Add Category
  static async AddCategory(category: TyCategory): Promise<number> {
    if (!coll) {
      console.log('no coll')
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    console.log('category: ', category)
    return await CommonModel.AddOne(coll, category, { title: category.title });
    
  }

  static async searchCategories(
    search?: string,
    findProps: TyCategory = {},
    projProps: TyCategory = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyCategory[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.search(coll, search, findProps, projProps, limit, page, sort)) as TyCategory[];
  }

  static async getManyCategories(findProps?: TyCategory, projProps?:{}, limit?: number, page?: number, sort?: {}): Promise<TyCategory[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getMany(coll, findProps, projProps, limit, page, sort)) as TyCategory[];
  }

  static async getCategory(findProps: TyCategory, projProps?: TyCategory, refs?: TyRef[]): Promise<TyCategory | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as TyCategory | null;
  }

  static async updateCategory(findProps: TyCategory, updateProps: TyCategory): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }
  static async deleteCategory(props: {}): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.deleteOne(coll, props);
  }
}
