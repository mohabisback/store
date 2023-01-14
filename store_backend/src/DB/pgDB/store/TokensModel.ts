import { Ref } from '../../../interfaces/general';
import { TokenSecret } from '../../../interfaces/users';
import { dbResetOrUp } from '../../dbState';
import CommonModel from '../CommonModel';
import { connRelease } from '../pgClient';

const table = 'tokens';

export default class TokensModel {
  //for new collection schema settings
  static async migrationsUp():Promise<void>{
    try{
      
    } catch (err){

    }
  }
  //under construction
  static async checkTokenSecrets(props: {}): Promise<number> {
    return await CommonModel.getCount(table, props);
  }

  static async addTokenSecret(tokenSecret: TokenSecret): Promise<number> {
    return await CommonModel.AddOne(table, tokenSecret);
  }

  static async replaceTokenSecret(newTokenSecret: TokenSecret, oldTokenSecret: TokenSecret): Promise<boolean> {
    const { id, ...rest } = newTokenSecret;
    return await CommonModel.updateOne(table, { id: oldTokenSecret.id }, rest);
  }

  //get token secret according to email & secret

  static async getSomeTokenSecrets(
    props: TokenSecret,
    limit?: number,
    page?: number,
    sort?: {},
  ): Promise<TokenSecret[]> {
    return (await CommonModel.getSome(table, props)) as TokenSecret[];
  }

  static async getTokenSecret(findProps: TokenSecret, projProps?: TokenSecret, refs?:Ref[]): Promise<TokenSecret | null> {
    return (await CommonModel.getOne(table, findProps, projProps, refs)) as TokenSecret | null;
  }

  static async expireTokenSecret(props: {}): Promise<boolean> {
    return await CommonModel.updateOne(table, props, { expired: true });
  }

  static async expireAllTokenSecrets(props: {}): Promise<number> {
    return await CommonModel.updateAll(table, props, { expired: true });
  }
}
