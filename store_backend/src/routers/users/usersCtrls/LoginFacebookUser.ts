import CreateTokens from '../tokensCtrls/CreateTokens';
import { ErrAPI, Status } from '../../../ErrAPI';
import { NextFunction, TyRef, Request, Response } from '../../../types/general';
import { getSignedUser, EnRole, TyUser } from '../../../types/users';
import { TyCartItem } from '../../../types/store';
import { setCartItemsForUser } from './_functions';
import fetch from 'node-fetch';

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

const LoginFacebookUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userID, accessToken } = req.body;

  let cartItems: TyCartItem[] | undefined = req.body.cart;

  let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}?fields=id,name,first_name,last_name,email,picture&access_token=${accessToken}`;

  let payload: any;
  try {
    payload = await fetch(urlGraphFacebook, {
      method: 'GET',
    }).then((res) => res.json());
  } catch (err) {}

  if (!payload) {
    throw new ErrAPI(Status.BAD_GATEWAY, `Can't get user credentials from Facebook.`);
  }

  const { email, first_name, last_name, picture } = payload;

  if (!email) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing credentials.');
  }
  //get user from database
  let user = await UsersModel.getUser({ email }, undefined, [cartItemsRef]);

  if (!user) {
    //if not user then register new one
    user = {
      email,
      firstName: first_name,
      lastName: last_name,
      role: EnRole.user,
      verifiedEmail: true,
      signUpDate: new Date(),
      signInDate: new Date(),
    };
    user.id = await UsersModel.AddUser(user);
    if (!user.id) user = undefined;
  }

  if (user) {
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
      message: 'Google login failed',
    });
  }
};
export default LoginFacebookUser;
