import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { TyTokenSecret } from '../../../types/users';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName, dbResetOrUp } from '../../dbState';
import { TyRef } from '../../../types/general';

export const collName = 'tokens';
export let coll: Collection;

export default class TokensModel {
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
  //under construction
  static async checkTokenSecrets(props: {}): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.getCount(coll, props);
  }

  static async addTokenSecret(tokenSecret: TyTokenSecret): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, tokenSecret);
  }

  static async replaceTokenSecret(newTokenSecret: TyTokenSecret, oldTokenSecret: TyTokenSecret): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    const { id, ...rest } = newTokenSecret;
    return await CommonModel.updateOne(coll, { id: oldTokenSecret.id }, rest);
  }

  //get token secret according to email & secret

  static async getManyTokenSecrets(
    props: TyTokenSecret,
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyTokenSecret[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getMany(coll, props)) as TyTokenSecret[];
  }

  static async getTokenSecret(
    findProps: TyTokenSecret,
    projProps?: TyTokenSecret,
    refs?: TyRef[],
  ): Promise<TyTokenSecret | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as TyTokenSecret | null;
  }

  static async expireTokenSecret(props: {}): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateOne(coll, props, { expired: true });
  }

  static async expireAllTokenSecrets(props: {}): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.updateAll(coll, props, { expired: true });
  }
}
