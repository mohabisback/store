import jwt from 'jsonwebtoken';

import { Status } from '../../../ErrAPI';
import AddLogoutTokens from '../tokensCtrls/AddLogoutTokens';
import { NextFunction, Request, Response } from '../../../types/general';
import { JwtPayload } from '../../../types/users';

//import TokensModel from '../../../DB/mongoDB/store/TokensModel' //mongoDB model
//import TokensModel from '../../../DB/pgDB/store/TokensModel' //pgDB model
const TokensModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/TokensModel`).default;

const LogoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //get signed cookies from request
    const refreshToken: string | undefined = req.signedCookies;
    if (refreshToken) {
      let payload = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as JwtPayload;
      if (payload.user && payload.user.email && payload.secret) {
        //search for this token secret in the database
        await TokensModel.expireTokenSecret({ email: payload.user.email, secret: payload.secret });
      }
    }
  } catch (err) {} //do nothing
  AddLogoutTokens(req, res);
  req.user = undefined;
  res.status(Status.OK).send({ signedUser: null, message: 'Successfully logged out.' });
};
export default LogoutUser;
