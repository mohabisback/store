import { ErrAPI, Status } from '../../../ErrAPI';
import { EmailFormat, Ref } from '../../../interfaces/general';
import { User } from '../../../interfaces/users';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
 const UsersModel = require(`../../../DB/${
   process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
 }/store/UsersModel`).default;
 
const cartItemsRef:Ref = {table: 'cartItems', projProps: {}, column: 'user_id', toColumn: 'id' }
export const getUserEmailOrId = async (params: any): Promise<User> => {
  const { emailOrId } = params;
  const id = parseInt(emailOrId);
  //get user from database
  let user: User | null;
  if (Number.isInteger(id)) {
    user = await UsersModel.getUser({ id }, undefined, [cartItemsRef]);
  } else if (emailOrId.match(EmailFormat)) {
    user = await UsersModel.getUser({ email: emailOrId }, undefined, [cartItemsRef]);
  } else {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing credentials.');
  }
  if (!user) {
    throw new ErrAPI(Status.NOT_FOUND, 'User not found.');
  }
  return user;
};
