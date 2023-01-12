import { Status } from '../../../ErrAPI';
import { NextFunction, Request, Response } from '../../../interfaces/general';
import { Role, User, UserTemp } from '../../../interfaces/users';
import { cleanObject, getQuery } from '../../_functions';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

const GetUsers = async (req: Request, res: Response, next: NextFunction) => {
  const query = getQuery(req.query, UserTemp);
  const projection: User = {}

  const respond = await UsersModel.getAllUsers(query.search, query.props, projection, query.limit, query.page, query.sort);

  const unReadables: (keyof User)[] = ['password', 'verifyToken', 'passToken', 'passTokenExp'];
  if(respond.results){
    for (let user of respond.results) {
      //remove props editor shouldn't see
      user = cleanObject(user, null, unReadables);
      //change the role secret to string
      user.role = Object.keys(Role)[Object.values(Role).indexOf(user.role as any)];

    }
  }
  res.status(Status.OK).send({ ...respond });
};
export default GetUsers;
