import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { TokenSecret } from '../../../interfaces/users';
import CommonModel from '../CommonModel';
import { noConnMess } from '../../../ErrAPI';
import { dbName } from '../mongoClient';
import { Ref } from '../../../interfaces/general';

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

  static async addTokenSecret(tokenSecret: TokenSecret): Promise<number> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return await CommonModel.AddOne(coll, tokenSecret);
  }

  static async replaceTokenSecret(newTokenSecret: TokenSecret, oldTokenSecret: TokenSecret): Promise<boolean> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    const { id, ...rest } = newTokenSecret;
    return await CommonModel.updateOne(coll, { id: oldTokenSecret.id }, rest);
  }

  //get token secret according to email & secret

  static async getSomeTokenSecrets(
    props: TokenSecret,
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TokenSecret[]> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getSome(coll, props)) as TokenSecret[];
  }

  static async getTokenSecret(findProps: TokenSecret, projProps?: TokenSecret, refs?:Ref[]): Promise<TokenSecret | null> {
    if (!coll) {
      throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
    }
    return (await CommonModel.getOne(coll, findProps, projProps, refs)) as TokenSecret | null;
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
