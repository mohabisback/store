import { Status } from '../../../ErrAPI';
import { NextFunction, Request, Response } from '../../../types/general';
import { EnRole, TyUser, TmUser } from '../../../types/users';
import { cleanObject, getQuery } from '../../_functions';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

const GetUsers = async (req: Request, res: Response, next: NextFunction) => {
  const query = getQuery(req.query, TmUser);
  const projection: TyUser = {};

  const respond = await UsersModel.searchUsers(
    query.search,
    query.props,
    projection,
    query.limit,
    query.page,
    query.sort,
  );

  const unReadables: (keyof TyUser)[] = ['password', 'verifyToken', 'passToken', 'passTokenExp'];
  if (respond.results) {
    for (let user of respond.results) {
      //remove props editor shouldn't see
      user = cleanObject(user, null, unReadables);
      //change the role secret to string
      user.role = Object.keys(EnRole)[Object.values(EnRole).indexOf(user.role as any)];
    }
  }
  res.status(Status.OK).send({ ...respond });
};
export default GetUsers;
