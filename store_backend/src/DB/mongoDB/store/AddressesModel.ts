import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { Address } from '../../../interfaces/users';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName, dbResetOrUp } from '../../dbState';
import { Ref } from '../../../interfaces/general';

const collName = 'addresses';
let coll: Collection;

export default class AddressesModel {
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
  static async getAddressesCount(props: {}): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  //checks Email already exists then adds address, returns id
  static async AddAddress(address: Address): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, address);
  }

  static async getAllAddresses(search?: string, findProps: Address = {}, projProps: Address = {}, limit?: number, page?: number, sort?: {}): Promise<Address[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getAll(coll, search, findProps, projProps, limit, page, sort)) as Address[];
  }

  static async getSomeAddresses(props: Address, limit?: number, page?: number, sort?: {}): Promise<Address[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getSome(coll, props)) as Address[];
  }
  static async getAddress(findProps: Address, projProps?: Address, refs?:Ref[]): Promise<Address | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as Address | null;
  }

  static async updateAddress(findProps: {}, updateProps: {}): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }
  static async deleteAddress(props: {}): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.deleteOne(coll, props);
  }
}
