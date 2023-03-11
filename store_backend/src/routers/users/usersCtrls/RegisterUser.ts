import CreateTokens from '../tokensCtrls/CreateTokens';
import sendVerificationEmail from '../../../utils/sendVerificationEmail';
import { Status, ErrAPI } from '../../../ErrAPI';
import { EmailFormat } from '../../../types/general';
import { Request, Response, NextFunction } from 'express';
import { getSignedUser, EnRole, TyUser, TmUser } from '../../../types/users';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { cleanObject } from '../../_functions';
import { TyCartItem, TmCartItem } from '../../../types/store';
import CartItemsModel from '../../../DB/mongoDB/store/CartItemsModel';
import adjustLoginCartItem from '../../store/cartItemsCtrls/adjustCartItem';
import { setCartItemsForUser } from './_functions';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel'; //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

const RegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  //get only allowed props from body.user
  let user: TyUser | undefined = req.body.user;
  let cartItems: TyCartItem[] | undefined = req.body.cartItems;

  if (!user) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing Info.');
  }

  //adjust user object
  const unEditables: (keyof TyUser)[] = ['id', 'passToken', 'passTokenExp'];
  user = cleanObject(user, TmUser, unEditables);
  //check essentials
  if (!user || !user.email || !user.email.match(EmailFormat) || !user.firstName || !user.lastName || !user.password) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing Info.');
  }

  //set defaults
  user.verifiedEmail = false;
  user.role = EnRole.user;
  user.password = await bcrypt.hash(user.password as string, 10);
  user.verifyToken = crypto.randomBytes(40).toString('hex');
  user.signInDate = new Date();
  user.signUpDate = new Date();

  //add user to database
  user.id = await UsersModel.AddUser(user);

  //After Insertion actions: email & tokens
  if (user.id) {
    //create tokens
    try {
      await CreateTokens(req, res, user);
    } catch (err) {
      console.log('Tokens creation failed.');
    }

    //send verification email
    try {
      await sendVerificationEmail(
        user.firstName + ' ' + user.lastName,
        user.email as string,
        user.verifyToken as string,
      );
    } catch (err) {
      console.log('Email failed');
    }

    //send response user to client in response & response message
    res.status(Status.CREATED).send({
      signedUser: getSignedUser(user),
      cartItems: await setCartItemsForUser(user.id, cartItems, true),
      message: 'Account Created! Please check your email to verify account',
    });
  } else {
    res.status(Status.NOT_ACCEPTABLE).send({
      signedUser: null,
      cartItems,
      message: 'Registration failed.',
    });
  }
};

export default RegisterUser;
