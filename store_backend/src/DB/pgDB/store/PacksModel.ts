import { Ref } from '../../../interfaces/general';
import { Pack } from '../../../interfaces/store';
import { dbResetOrUp } from '../../dbState';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';

const table = 'packs';

export default class PacksModel {
  //for new collection schema settings
  static async migrationsUp():Promise<void>{
    try{
      
    } catch (err){

    }
  }
  //Get Count of Documents with specific props
  static async getPacksCount(props: Pack): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  //Add Pack
  static async AddPack(pack: Pack): Promise<number> {
    return await CommonModel.AddOne(table, pack);
  }

  static async getAllPacks(search?: string, findProps: Pack = {},  projProps: Pack = {}, limit?: number, page?: number, sort?: {}): Promise<Pack[]> {
    return (await CommonModel.getAll(table, search, findProps, projProps, limit, page, sort)) as Pack[];
  }

  static async getSomePacks(props: Pack, limit?: number, page?: number, sort?: {}): Promise<Pack[]> {
    return (await CommonModel.getSome(table, props)) as Pack[];
  }

  static async getPack(findProps: Pack, projProps?: Pack, refs?:Ref[]): Promise<Pack | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as Pack | null;
  }

  static async updatePack(findProps: Pack, updateProps: Pack): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }
}
