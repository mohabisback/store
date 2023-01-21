import { Status, ErrAPI } from '../../../ErrAPI';
import { TyRef } from '../../../types/general';
import { TyUser } from '../../../types/users';
import { dbResetOrUp } from '../../dbState';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';
import { sqlUpdate } from '../sqlFactory';

const table = 'users';

export default class UsersModel {
  //Get Count of Documents with specific props
  static async getUsersCount(props: TyUser): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  //checks Email already exists then adds user, returns id
  static async AddUser(user: TyUser): Promise<number> {
    return await CommonModel.AddOne(table, user, { email: user.email }); 
  }

  static async searchUsers(
    search?: string,
    findProps: TyUser = {},
    projProps: TyUser = {},
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyUser[]> {
    return (await CommonModel.search(table, search, findProps, projProps, limit, page, sort)) as TyUser[];
  }

  static async getManyUsers(props: TyUser, limit?: number, page?: number, sort?: {}): Promise<TyUser[]> {
    return (await CommonModel.getMany(table, props)) as TyUser[];
  }

  static async updateUser(findProps: TyUser, updateProps: TyUser): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }

  //get user with
  static async getUser(findProps: TyUser, projProps?: TyUser, refs?: TyRef[]): Promise<TyUser | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as TyUser | null;
  }
}
