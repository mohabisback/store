import { ErrAPI, Status } from '../../../ErrAPI';
import { NextFunction, Request, Response } from '../../../interfaces/general';
import { User, Access, Role, UserTemp } from '../../../interfaces/users';
import { getUserEmailOrId } from './_functions';
import { cleanObject } from '../../_functions';
import { sameUserAuth } from '../../authorize';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
  //extract id, email
  const user = await getUserEmailOrId(req.params);
  let props: User|undefined = { ...req.body.user };
  if (!props) {
    throw new ErrAPI(Status.METHOD_NOT_ALLOWED, 'Missing info.');
  }
  if (props.password) {
    throw new ErrAPI(Status.METHOD_NOT_ALLOWED, 'Cant change password in this route.');
  }
  const unEditables: (keyof User)[] = [
    'id',
    'email',
    'password',
    'verifyToken',
    'passToken',
    'passTokenExp',
    'signInDate',
    'signUpDate',
    'verifiedEmail',
  ];

  //check role
  if (req.user && req.user.role && Access.editor.toString().includes(req.user.role)) {
    //roles
    if (props.role) {
      //return real role not string name
      props.role = Role[props.role as keyof typeof Role];
      //only owner & admin can change any role
      if (!(req.user && req.user.role && Access.ownerAdmin.toString().includes(req.user.role))) {
        unEditables.push('role');
      }
      //only owner can create an admin or an owner
      if (props.role == Role.owner || props.role == Role.admin) {
        if (!(req.user && req.user.role && Access.ownerOnly.toString().includes(req.user.role))) {
          unEditables.push('role');
        }
      }
    }
  } else if (sameUserAuth(user.id, req.user?.id)) {
    //remove what default user can't update
    unEditables.push('role');
  } else {
    throw new ErrAPI(Status.UNAUTHORIZED, 'Unauthorized update.');
  }
  props = cleanObject(props, UserTemp, unEditables);
  //@ts-ignore
  if (Object.keys(props).length === 0 || Object.keys(props)[0] == '0') {
    throw new ErrAPI(Status.METHOD_NOT_ALLOWED, 'Cant update this property.');
  }
  //update
  let result = await UsersModel.updateUser({ id: user.id }, props);

  const status = result ? Status.OK : Status.BAD_GATEWAY;
  const message = result ? 'Updated' : 'Failed to Update';
  //send response user to client in response & response message
  res.status(status).send(message);
};

export default UpdateUser;
