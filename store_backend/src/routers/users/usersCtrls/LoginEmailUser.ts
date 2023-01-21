import bcrypt from 'bcrypt';
import CreateTokens from '../tokensCtrls/CreateTokens';
import { ErrAPI, Status } from '../../../ErrAPI';
import { NextFunction, TyRef, Request, Response } from '../../../types/general';
import { getSignedUser, TyUser } from '../../../types/users';
import { TyCartItem, TmCartItem } from '../../../types/store';
import { cleanObject } from '../../_functions';
import adjustLoginCartItem from '../../store/cartItemsCtrls/adjustCartItem';
import { setCartItemsForUser } from './_functions';

//import CartItemsModel from '../../../DB/mongoDB/store/CartItemsModel'; //mongoDB model
//import CartItemsModel from '../../../DB/pgDB/store/CartItemsModel' //pgDB model
const CartItemsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/CartItemsModel`).default;
//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

const cartItemsRef: TyRef = { table: 'cartItems', projProps: {}, column: 'user_id', toColumn: 'id' };

const LoginEmailUser = async (req: Request, res: Response, next: NextFunction) => {
  let id: any | undefined = req.body.user.id;
  let email: string | undefined = req.body.user.email;
  let password: string | undefined = req.body.user.password;
  let cartItems: TyCartItem[] | undefined = req.body.cartItems;

  id = parseInt(id);
  //get user from database
  let user: TyUser | null;
  if (email && password) {
    user = await UsersModel.getUser({ email }, undefined, [cartItemsRef]);
  } else if (id && password && Number.isInteger(id)) {
    user = await UsersModel.getUser({ id }, undefined, [cartItemsRef]);
  } else {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing credentials.');
  }
  if (!user) {
    throw new ErrAPI(Status.BAD_REQUEST, 'User not found.');
  }

  //Check credentials
  let passwordCheck = false;
  if (user.password) passwordCheck = await bcrypt.compare(password, user.password);

  if (passwordCheck) {
    //create tokens
    try {
      await CreateTokens(req, res, user);
    } catch (err) {
      console.log('Tokens creation failed.');
    }
    //send response user to client in response & response message
    res.status(Status.ACCEPTED).send({
      signedUser: getSignedUser(user),
      cartItems: !user.id ? cartItems : await setCartItemsForUser(user.id, cartItems),
      message: 'Logged in successfully',
    });
  } else {
    res.status(Status.NOT_ACCEPTABLE).send({
      signedUser: null,
      cartItems,
      message: 'Log in failed',
    });
  }
};
export default LoginEmailUser;
