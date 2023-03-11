import bcrypt from 'bcrypt';
import CreateTokens from '../tokensCtrls/CreateTokens';
import { OAuth2Client, UserRefreshClient } from 'google-auth-library';
import { ErrAPI, Status } from '../../../ErrAPI';
import { NextFunction, TyRef, Request, Response } from '../../../types/general';
import { getSignedUser, EnRole, TyUser } from '../../../types/users';
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

const oAuth2Client = new OAuth2Client(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  'postmessage', //leave this as it is
);

const cartItemsRef: TyRef = { table: 'cartItems', projProps: {}, column: 'user_id', toColumn: 'id' };

const LoginGoogleUser = async (req: Request, res: Response, next: NextFunction) => {
  let code = req.body.code;
  let cartItems: TyCartItem[] | undefined = req.body.cartItems;

  // exchange code for tokens
  const { tokens } = await oAuth2Client.getToken(code);

  if (!tokens.id_token) {
    throw new ErrAPI(Status.BAD_GATEWAY, `Can't get tokens from Google.`);
  }
  // exchange id_token for ticket.payload
  const payload = (
    await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.OAUTH_CLIENT_ID,
    })
  ).getPayload();

  if (!payload) {
    throw new ErrAPI(Status.BAD_GATEWAY, `Can't get user credentials from Google.`);
  }

  const { email, email_verified, given_name, family_name, picture, locale } = payload;

  if (!email) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing credentials.');
  }
  //get user from database
  let user = await UsersModel.getUser({ email }, undefined, [cartItemsRef]);

  if (!user) {
    //if not user then register new one
    user = {
      email,
      firstName: given_name,
      lastName: family_name,
      role: EnRole.user,
      verifiedEmail: email_verified,
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
export default LoginGoogleUser;
