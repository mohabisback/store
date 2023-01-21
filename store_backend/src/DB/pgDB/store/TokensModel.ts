import { TyRef } from '../../../types/general';
import { TyTokenSecret } from '../../../types/users';
import { dbResetOrUp } from '../../dbState';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';

const table = 'tokens';

export default class TokensModel {
  //for new collection schema settings
  static async migrationsUp(): Promise<void> {
    try {
    } catch (err) {}
  }
  //under construction
  static async checkTokenSecrets(props: {}): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  static async addTokenSecret(tokenSecret: TyTokenSecret): Promise<number> {
    return await CommonModel.AddOne(table, tokenSecret);
  }

  static async replaceTokenSecret(newTokenSecret: TyTokenSecret, oldTokenSecret: TyTokenSecret): Promise<boolean> {
    const { id, ...rest } = newTokenSecret;
    return await CommonModel.updateOne(table, { id: oldTokenSecret.id }, rest);
  }

  //get token secret according to email & secret

  static async getManyTokenSecrets(
    props: TyTokenSecret,
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TyTokenSecret[]> {
    return (await CommonModel.getMany(table, props)) as TyTokenSecret[];
  }

  static async getTokenSecret(
    findProps: TyTokenSecret,
    projProps?: TyTokenSecret,
    refs?: TyRef[],
  ): Promise<TyTokenSecret | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as TyTokenSecret | null;
  }

  static async expireTokenSecret(props: {}): Promise<boolean> {
    return await CommonModel.updateOne(table, props, { expired: true });
  }

  static async expireAllTokenSecrets(props: {}): Promise<number> {
    return await CommonModel.updateAll(table, props, { expired: true });
  }
}
