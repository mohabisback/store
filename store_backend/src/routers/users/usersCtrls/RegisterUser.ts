import CreateTokens from '../tokensCtrls/CreateTokens';
import sendVerificationEmail from '../../../utils/sendVerificationEmail';
import { Status, ErrAPI } from '../../../ErrAPI';
import { EmailFormat } from '../../../interfaces/general';
import {Request, Response, NextFunction} from 'express'
import { getResUser, Role, User, UserTemp } from '../../../interfaces/users';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { cleanObject } from '../../_functions';
import { CartItem, CartItemTemp } from '../../../interfaces/store';
import CartItemsModel from '../../../DB/mongoDB/store/CartItemsModel';
import adjustLoginCartItem from '../../store/cartItemsCtrls/adjustCartItem';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

const RegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  //get only allowed props from body.user
  let user: User|undefined = req.body.user;
  let cartItems: CartItem[]|undefined = req.body.cartItems;
  
  if (!user){
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing Info.');
  }
  //adjust user object
  const unEditables: (keyof User)[] = ['id', 'passToken', 'passTokenExp'];
  user = cleanObject(user, UserTemp, unEditables);


  //check essentials
  if (!user || !user.email || !user.email.match(EmailFormat) || !user.firstName || !user.lastName || !user.password) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing Info.');
  }

  //set defaults
  user.verifiedEmail = false;
  user.role = Role.user;
  user.password = await bcrypt.hash(user.password as string, 10);
  user.verifyToken = crypto.randomBytes(40).toString('hex');
  user.signInDate = new Date();
  user.signUpDate = new Date();

  //add user to database
  user.id = await UsersModel.AddUser(user);
  //add cartItems to database
  let finalCartItems:CartItem[] = []
  //adjust and add cartItems
  if (cartItems && cartItems.length && Array.isArray(cartItems)){
    if(user.id){
      //set defaults and add
      for (let item of cartItems) {
        const newItem:CartItem = cleanObject({ ...item }, CartItemTemp)//, itemUnEditables);
        if (newItem.product_id && newItem.quantity) {
          try{
            finalCartItems = await adjustLoginCartItem(newItem.product_id,newItem.quantity, user.id)
          }catch(err){
            console.log('Adding one cartItem failed.')
          }
        }  
      }
    }
  }

    //After Insertion actions: email & tokens
  if (user.id) {
    try {
      //send verification email
      await sendVerificationEmail(
        user.firstName + ' ' + user.lastName,
        user.email as string,
        user.verifyToken as string,
      );
    } catch (err) {
      console.log('Email failed');
    }
    try{
      await CreateTokens(req, res, user);
    } catch(err){
      console.log('Tokens creation failed.')
    }
    //send response user to client in response & response message
    res.status(Status.CREATED).send({
        user: getResUser(user),
        cartItems: finalCartItems,
        message: 'Account Created! Please check your email to verify account' 
      });
  } else {
    res.status(Status.NOT_ACCEPTABLE).send({
      user: null,
      cartItems,
      message: 'Registration failed' 
    });
  }
};

export default RegisterUser;
