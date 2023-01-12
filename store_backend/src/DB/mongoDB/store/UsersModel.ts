import { Collection, MongoClient, UpdateResult } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { User } from '../../../interfaces/users';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName } from '../mongoClient';
import { Ref } from '../../../interfaces/general';

const collName = 'users';
let coll: Collection;

export default class UsersModel {
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
  static async getUsersCount(props: User): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  //checks Email already exists then adds user, returns id
  static async AddUser(user: User): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, user, { email: user.email });
  }

  static async getAllUsers(search?: string, findProps: User = {}, projProps: User = {}, limit?: number, page?: number, sort?: {}): Promise<User[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getAll(coll, search, findProps, projProps, limit, page, sort)) as User[];
  }

  static async getSomeUsers(props: User, limit?: number, page?: number, sort?: {}): Promise<User[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getSome(coll, props)) as User[];
  }

  static async getUser(findProps: User, projProps?: User, refs?:Ref[]): Promise<User | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as User | null;
  }

  static async updateUser(findProps: User, updateProps: User): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }
}
