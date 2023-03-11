import { Request, Response, EmailFormat, NextFunction } from '../../../types/general';
import { ErrAPI, Status } from '../../../ErrAPI';
import { TyUser, EnAccess, EnRole } from '../../../types/users';
import { getUserEmailOrId } from './_functions';
import { cleanObject } from '../../_functions';
import { sameUserAuth } from '../../authorize';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //mongoDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

//params.emailOrId
const GetUser = async (req: Request, res: Response, next: NextFunction) => {
  //extract id, email
  let user = await getUserEmailOrId(req.params);
  console.log('gotten user: ', user)
  const unReadables: (keyof TyUser)[] = ['password', 'verifyToken', 'passToken', 'passTokenExp'];
  //change the role secret to string
  user.role = Object.keys(EnRole)[Object.values(EnRole).indexOf(user.role as any)];

  //check if there is superior access
  if (req.user && req.user.role && EnAccess.editor.toString().includes(req.user.role)) {
    //pass
  } else if (sameUserAuth(user.id, req.user?.id)) {
    //remove props default user shouldn't read
    unReadables.push('signInDate', 'signUpDate');
  } else {
    throw new ErrAPI(Status.UNAUTHORIZED, 'Unauthorized.');
  }
  console.log('user before clean: ', user)
  user = cleanObject(user, null, unReadables);
  console.log('user after clean: ', user)
  res.status(Status.OK).send({user, message: 'user is sent.'});
};
export default GetUser;
