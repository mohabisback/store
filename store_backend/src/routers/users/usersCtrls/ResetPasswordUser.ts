import bcrypt from 'bcrypt';
import CreateTokens from '../tokensCtrls/CreateTokens';
import { ErrAPI, Status } from '../../../ErrAPI';
import { NextFunction, Request, Response } from '../../../types/general';
import { getSignedUser, TyUser } from '../../../types/users';
import { getUserEmailOrId } from './_functions';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

const ResetPasswordUser = async (req: Request, res: Response, next: NextFunction) => {
  //get credentials from body.user
  const passToken: string | undefined = req.query.passToken as string | undefined;
  const password: string | undefined = req.body.user.password;
  if (!passToken || !password) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing Credentials.');
  }
  const user = await getUserEmailOrId(req.params);
  if (!user) {
    throw new ErrAPI(Status.BAD_REQUEST, 'User not found');
  }
  //check password token existence
  if (!user.passToken || !user.passTokenExp) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Already Used Token');
  } else {
    //check password token
    let passTokenCheck = await bcrypt.compare(passToken as string, user.passToken);
    if (!passTokenCheck) {
      throw new ErrAPI(Status.UNAUTHORIZED, 'Wrong Token.');
    } else if (new Date() > user.passTokenExp) {
      throw new ErrAPI(Status.BAD_REQUEST, 'Expired Token.');
    } else {
      //create new password hash
      const hashedPassword = await bcrypt.hash(password, 10);
      let result = await UsersModel.updateUser(
        { id: user.id },
        {
          password: hashedPassword,
          passToken: '',
          signInDate: new Date(),
        },
      );
      //create token anyway, he had the right email token
      await CreateTokens(req, res, user);
      if (result) {
        res.status(Status.CREATED).send({ SignedUser: getSignedUser(user), message: 'Successfully Updated Password.' });
      } else {
        res.status(Status.BAD_GATEWAY).send({ SignedUser: getSignedUser(user), message: 'Failed password, but signed in.' });
      }
    }
  }
};
export default ResetPasswordUser;
