import { Collection, MongoClient, UpdateResult } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { TyUser } from '../../../types/users';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName, dbResetOrUp } from '../../dbState';
import { TyRef } from '../../../types/general';

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
  static async getUsersCount(props: TyUser): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  //checks Email already exists then adds user, returns id
  static async AddUser(user: TyUser): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, user, { email: user.email });
  }

  static async searchUsers(
    search?: string,
    findProps: TyUser = {},
    projProps: TyUser = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyUser[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.search(coll, search, findProps, projProps, limit, page, sort)) as TyUser[];
  }

  static async getManyUsers(props: TyUser, limit?: number, page?: number, sort?: {}): Promise<TyUser[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getMany(coll, props)) as TyUser[];
  }

  static async getUser(findProps: TyUser, projProps?: TyUser, refs?: TyRef[]): Promise<TyUser | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as TyUser | null;
  }

  static async updateUser(findProps: TyUser, updateProps: TyUser): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, findProps, updateProps);
  }
}
