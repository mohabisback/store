import { Pool } from 'pg';
import { TyRef } from '../../../types/general';
import { TyAddress } from '../../../types/users';
import { dbName, dbResetOrUp } from '../../dbState';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';

const table = 'addresses';

export default class AddressesModel {
  //Get Count of Documents with specific props
  static async getAddressesCount(props: {}): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  //checks Email already exists then adds address, returns id
  static async AddAddress(address: TyAddress): Promise<number> {
    return await CommonModel.AddOne(table, address);
  }

  static async searchAddresses(
    search?: string,
    findProps: TyAddress = {},
    projProps: TyAddress = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyAddress[]> {
    return (await CommonModel.search(table, search, findProps, projProps, limit, page, sort)) as TyAddress[];
  }

  static async getManyAddresses(props: TyAddress, limit?: number, page?: number, sort?: {}): Promise<TyAddress[]> {
    return (await CommonModel.getMany(table, props)) as TyAddress[];
  }

  static async getAddress(findProps: TyAddress, projProps?: TyAddress, refs?: TyRef[]): Promise<TyAddress | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as TyAddress | null;
  }

  static async updateAddress(findProps: {}, updateProps: {}): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }
  static async deleteAddress(props: {}): Promise<boolean> {
    return await CommonModel.deleteOne(table, props);
  }
}
