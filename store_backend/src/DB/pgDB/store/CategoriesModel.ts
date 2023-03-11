import { TyRef } from '../../../types/general';
import { TyCategory } from '../../../types/store';
import { dbResetOrUp } from '../../dbState';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';

const table = 'categories';

export default class CategoriesModel {
  //for new collection schema settings
  static async migrationsUp(): Promise<void> {
    try {
    } catch (err) {}
  }
  //Get Count of Documents with specific props
  static async getCategoriesCount(props: TyCategory): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  //Add Category
  static async AddCategory(category: TyCategory): Promise<number> {
    return await CommonModel.AddOne(table, category, { title: category.title });
  }

  static async searchCategories(
    search?: string,
    findProps: TyCategory = {},
    projProps: TyCategory = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyCategory[]> {
    return (await CommonModel.search(table, search, findProps, projProps, limit, page, sort)) as TyCategory[];
  }

  static async getManyCategories(props: TyCategory, limit?: number, page?: number, sort?: {}): Promise<TyCategory[]> {
    return (await CommonModel.getMany(table, props)) as TyCategory[];
  }

  static async getCategory(findProps: TyCategory, projProps?: TyCategory, refs?: TyRef[]): Promise<TyCategory | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as TyCategory | null;
  }

  static async updateCategory(findProps: TyCategory, updateProps: TyCategory): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }
  static async deleteCategory(props: {}): Promise<boolean> {
    return await CommonModel.deleteOne(table, props);
  }
}
