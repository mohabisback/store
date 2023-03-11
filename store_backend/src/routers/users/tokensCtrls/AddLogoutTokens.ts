import { Request } from '../../../types/general';
import { Response } from 'express';

const AddLogoutTokens = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    maxAge: 0,
    signed: true,
    sameSite: !process.env.ENV?.includes('dev') ? 'none' : 'strict', //must be none for Heroku.com
    secure: !process.env.ENV?.includes('dev'), //must be true for previous 'none'
  });
  res.clearCookie('accessToken');
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    maxAge: 0,
    signed: true,
    sameSite: !process.env.ENV?.includes('dev') ? 'none' : 'strict', //must be none for Heroku.com
    secure: !process.env.ENV?.includes('dev'), //must be true for previous 'none'
  });
  return res;
};

export default AddLogoutTokens;
