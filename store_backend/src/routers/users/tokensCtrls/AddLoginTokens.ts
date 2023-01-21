import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { TyUser } from '../../../types/users';

//Add refresh & access tokens to response
const AddLoginTokens = async (res: Response, tokenUser: TyUser, refreshToken: string) => {
  if (refreshToken) {
    //add refreshToken to response
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 5000, //5000 days
      signed: true,
      sameSite: !process.env.ENV?.includes('dev') ? 'none' : 'strict', //must be none for Heroku.com
      secure: !process.env.ENV?.includes('dev'), //must be true for previous 'none'
    });
  } else {
  }
  //create access token
  const accessToken = jwt.sign({ user: tokenUser }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });

  //add access token to response
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 30, //30 minutes
    signed: true,
    sameSite: !process.env.ENV?.includes('dev') ? 'none' : 'strict', //must be none for Heroku.com
    secure: !process.env.ENV?.includes('dev'), //must be true for previous 'none'
  });
  return res;
};

export default AddLoginTokens;
