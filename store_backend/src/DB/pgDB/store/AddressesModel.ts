import { Ref } from '../../../interfaces/general';
import { Address } from '../../../interfaces/users';
import CommonModel from '../CommonModel';

const table = 'addresses';

export default class AddressesModel {
  //Get Count of Documents with specific props
  static async getAddressesCount(props: {}): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  //checks Email already exists then adds address, returns id
  static async AddAddress(address: Address): Promise<number> {
    return await CommonModel.AddOne(table, address);
  }

  static async getAllAddresses(search?: string, findProps: Address = {}, projProps:Address = {}, limit?: number, page?: number, sort?: {}): Promise<Address[]> {
    return (await CommonModel.getAll(table, search, findProps, projProps, limit, page, sort)) as Address[];
  }

  static async getSomeAddresses(props: Address, limit?: number, page?: number, sort?: {}): Promise<Address[]> {
    return (await CommonModel.getSome(table, props)) as Address[];
  }

  static async getAddress(findProps: Address, projProps?: Address, refs?:Ref[]): Promise<Address | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as Address | null;
  }

  static async updateAddress(findProps: {}, updateProps: {}): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }
  static async deleteAddress(props: {}): Promise<boolean> {
    return await CommonModel.deleteOne(table, props);
  }
}
