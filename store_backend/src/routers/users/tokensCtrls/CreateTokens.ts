import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Request } from '../../../interfaces/general';
import { Response } from 'express';
import { TokenSecret, getTokenUser, User } from '../../../interfaces/users';
import AddLoginTokens from './AddLoginTokens';

//import TokensModel from '../../../DB/mongoDB/store/TokensModel' //mongoDB model
//import TokensModel from '../../../DB/pgDB/store/TokensModel' //pgDB model
const TokensModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/TokensModel`).default;

//create token secret, add it to database, return refresh token
const CreateTokens = async (req: Request, res: Response, dbUser: User, oldTokenSecret?: TokenSecret): Promise<void> => {
  try {
    const tokenUser = getTokenUser(dbUser);
    //secret for the jwt
    const secret = crypto.randomBytes(40).toString('hex');

    const tokenSecret: TokenSecret = {
      secret,
      email: tokenUser.email as string,
      ip: req.ip,
      date: new Date(),
      expired: false,
    };
    //in case of oldTokenSecret, then i am authenticating, not creating
    if (oldTokenSecret) {
      //replace the old token secret
      //for more security add new tokens, don't replace, and check for old tokens with emails to target malicious users
      await TokensModel.replaceTokenSecret(tokenSecret, oldTokenSecret);
    } else {
      //add new token secret to database
      await TokensModel.addTokenSecret(tokenSecret);
    }

    //return refresh token
    const refreshToken = jwt.sign({ user: tokenUser, secret }, process.env.JWT_SECRET as string); //no expiration

    await AddLoginTokens(res, tokenUser, refreshToken);
  } catch (err) {
    /* do nothing*/
  }
};
export default CreateTokens;
