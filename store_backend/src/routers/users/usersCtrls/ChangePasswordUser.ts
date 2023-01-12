import { ErrAPI, Status } from '../../../ErrAPI';
import { EmailFormat, NextFunction, Request, Response } from '../../../interfaces/general';
import bcrypt from 'bcrypt';
import { User } from '../../../interfaces/users';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

const ChangePasswordUser = async (req: Request, res: Response, next: NextFunction) => {
  let newPassword:string|undefined = req.body.user.newPassword
  let oldPassword:string|undefined = req.body.user.oldPassword
  if (!newPassword || !oldPassword) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }

  const { emailOrId } = req.params;
  const id = parseInt(emailOrId);
  //get user from database
  let user: User | null;
  if (Number.isInteger(id)) {
    user = await UsersModel.getUser({ id }, undefined, undefined);
  } else if (emailOrId.match(EmailFormat)) {
    user = await UsersModel.getUser({ email: emailOrId }, undefined, undefined);
  } else {
    throw new ErrAPI(Status.UNAUTHORIZED, 'Missing credentials.');
  }
  if (!user) {
    throw new ErrAPI(Status.NOT_FOUND, 'User not found.');
  }

  if (user) {
    //Check credentials
    let passwordCheck = false;
    if (user.password) passwordCheck = await bcrypt.compare(oldPassword, user.password);
    if (!passwordCheck) {
      throw new ErrAPI(Status.NOT_ACCEPTABLE, 'Wrong Old Password.');
    }
  } else {
    throw new ErrAPI(Status.NOT_FOUND, `Can't Get User Data.`);
  }
  //create new password
  let password = await bcrypt.hash(newPassword, 10);
  //update new password
  let result = await UsersModel.updateUser({ id: user.id }, { password });

  const status = result ? Status.OK : Status.BAD_GATEWAY;
  const message = result ? 'Changed Password' : 'Failed to Update';
  //send response user to client in response & response message
  res.status(Status.CREATED).send(message);
};

export default ChangePasswordUser;
