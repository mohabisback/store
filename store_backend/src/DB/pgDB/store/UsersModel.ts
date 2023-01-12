import { Status, ErrAPI } from '../../../ErrAPI';
import { Ref } from '../../../interfaces/general';
import { User } from '../../../interfaces/users';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';
import { sqlUpdate } from '../sqlFactory';

const table = 'users';

export default class UsersModel {
  //Get Count of Documents with specific props
  static async getUsersCount(props: User): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  //checks Email already exists then adds user, returns id
  static async AddUser(user: User): Promise<number> {
    return await CommonModel.AddOne(table, user, { email: user.email });
  }

  static async getAllUsers(search?: string, findProps: User = {}, projProps: User = {}, limit?: number, page?: number, sort?: {}): Promise<User[]> {
    return (await CommonModel.getAll(table, search, findProps, projProps, limit, page, sort)) as User[];
  }

  static async getSomeUsers(props: User, limit?: number, page?: number, sort?: {}): Promise<User[]> {
    return (await CommonModel.getSome(table, props)) as User[];
  }

  static async updateUser(findProps: User, updateProps: User): Promise<boolean> {
    return await CommonModel.updateOne(table, findProps, updateProps);
  }

  //get user with
  static async getUser(findProps: User, projProps?: User, refs?:Ref[]): Promise<User | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as User | null;
  }
}
