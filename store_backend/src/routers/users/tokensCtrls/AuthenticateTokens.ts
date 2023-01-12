import jwt from 'jsonwebtoken';
import AddLogoutTokens from './AddLogoutTokens';
import CreateTokens from './CreateTokens';
import { Request } from '../../../interfaces/general';
import { Response, NextFunction } from 'express';
import { JwtPayload, TokenSecret, User } from '../../../interfaces/users';
import { Role } from '../../../interfaces/users';

//import TokensModel from '../../../DB/mongoDB/store/TokensModel' //mongoDB model
//import TokensModel from '../../../DB/pgDB/store/TokensModel' //pgDB model
const TokensModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/TokensModel`).default;

//if authenticated passes req.user & res.user & new tokens
//if not authenticated req.user = null
const AuthenticateTokens = async (req: Request, res: Response, next: NextFunction) => {
  //Authentication for testing & development purposes
  if (process.env.ENV?.includes('owner')) {
    req.user = { id: 1, email: 'mohab1@email.com', role: Role.owner };
    return next();
  } else if (process.env.ENV?.includes('admin')) {
    req.user = { id: 2, email: 'mohab2@email.com', role: Role.admin };
    return next();
  } else if (process.env.ENV?.includes('editor')) {
    req.user = { id: 3, email: 'mohab3@email.com', role: Role.editor };
    return next();
  } else if (process.env.ENV?.includes('service')) {
    req.user = { id: 4, email: 'mohab4@email.com', role: Role.service };
    return next();
  } else if (process.env.ENV?.includes('user')) {
    req.user = { id: 5, email: 'mohab5@email.com', role: Role.user };
    return next();
  }
  //get signed cookies from request
  const { refreshToken, accessToken } = await req.signedCookies;

  //Go for accessToken
  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;
      req.user = payload.user;
      return next();
    } catch (err) {
      // Not valid accessToken, go for refresh token
    }
  }

  try {
    //Go for refreshToken
    if (!refreshToken) {
      // no refresh token also
      throw Error; //sign out
    } else {
      // refresh found
      // payload = { user, secret }
      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as JwtPayload;
      //search for this refresh token in the database
      let tokenSecret: TokenSecret | null = null;
      if (payload.user && payload.user.email && payload.secret) {
        tokenSecret = await TokensModel.getTokenSecret({ email: payload.user.email, secret: payload.secret });
      }

      if (!payload.user || !payload.user.email || !tokenSecret) {
        throw Error; //sign out
      } else if (tokenSecret.expired) {
        //malicious user conditions, to be modified
        TokensModel.expireAllTokenSecrets({ email: payload.user.email });
        throw Error; //sign out
      } else {
        //Secret is valid in database
        await CreateTokens(req, res, payload.user, tokenSecret);
        //attach the user to request
        req.user = payload.user;
        return next();
      }
    }
  } catch (err) {
    // Not valid refreshToken for any of 5 reasons above
    AddLogoutTokens(req, res);
    req.user = undefined;
    return next();
  }
  next();
};

export default AuthenticateTokens;
