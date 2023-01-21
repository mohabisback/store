import { TyRef } from '../../../types/general';
import { TyPack } from '../../../types/store';
import { dbResetOrUp } from '../../dbState';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';

const table = 'packs';

export default class PacksModel {
  //for new collection schema settings
  static async migrationsUp(): Promise<void> {
    try {
    } catch (err) {}
  }
  //Get Count of Documents with specific props
  static async getPacksCount(props: TyPack): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  //Add Pack
  static async AddPack(pack: TyPack): Promise<number> {
    return await CommonModel.AddOne(table, pack);
  }

  static async searchPacks(
    search?: string,
    findProps: TyPack = {},
    projProps: TyPack = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyPack[]> {
    return (await CommonModel.search(table, search, findProps, projProps, limit, page, sort)) as TyPack[];
  }

  static async getManyPacks(props: TyPack, limit?: number, page?: number, sort?: {}): Promise<TyPack[]> {
    return (await CommonModel.getMany(table, props)) as TyPack[];
  }

  static async getPack(findProps: TyPack, projProps?: TyPack, refs?: TyRef[]): Promise<TyPack | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as TyPack | null;
  }

  static async updatePack(findProps: TyPack, updateProps: TyPack): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }
}
