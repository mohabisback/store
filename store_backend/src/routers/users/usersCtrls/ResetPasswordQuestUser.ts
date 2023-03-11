import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { ErrAPI, Status } from '../../../ErrAPI';
import { NextFunction, Request, Response } from '../../../types/general';
import { TyUser } from '../../../types/users';
import sendEmail from '../../../utils/sendEmail';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

const ResetPasswordQuestUser = async (req: Request, res: Response, next: NextFunction) => {
  //get email from body.user
  const email: string | undefined = req.body.user.email;
  if (!email) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }
  //get user from database
  let user: TyUser | null = await UsersModel.getUser({ email }, undefined, undefined);

  if (!user) {
    // Don't send an Error that 'Account Not Found.'
  } else {
    //create a token for that password, then a hash for the token
    const passToken = crypto.randomBytes(70).toString('hex');
    const hashedToken = await bcrypt.hash(passToken, 10);
    //save the hashed token in database
    const result = await UsersModel.updateUser(
      { email },
      {
        passToken: hashedToken,
        passTokenExp: new Date(Date.now() + 1000 * 60 * 15),
      },
    );
    //send an email with that token as a link
    if (result) {
      const frontendURL = process.env.ENV?.includes('dev')
        ? process.env.FRONTEND_DEVELOPMENT
        : process.env.FRONTEND_PRODUCTION;
      const resetURL = `${frontendURL}/user/reset-password?passToken=${passToken}&email=${email}`;
      const message = `<p>Please reset password by clicking on the following link : 
      <a href='${resetURL}'>Reset Password</a></p>`;
      sendEmail(
        user.email as string,
        'Reset Password',
        `<h4>Hello, ${user.firstName as string} ${user.lastName as string} </h4>
       ${message}
       `,
      );
    }
  }
  res.status(Status.OK).send({
    message:
      'If there is an account associated with this email, ' +
      'A password reset link has been sent to this email.' +
      'It will be effective for only 15 minutes.',
  });
};
export default ResetPasswordQuestUser;
