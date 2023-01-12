import bcrypt from 'bcrypt';
import CreateTokens from '../tokensCtrls/CreateTokens';
import { ErrAPI, Status } from '../../../ErrAPI';
import { NextFunction, Ref, Request, Response } from '../../../interfaces/general';
import { getResUser, User } from '../../../interfaces/users';
import { CartItem, CartItemTemp } from '../../../interfaces/store';
import { cleanObject } from '../../_functions';
import adjustLoginCartItem from '../../store/cartItemsCtrls/adjustCartItem';

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

const cartItemsRef:Ref = {table: 'cartItems', projProps: {}, column: 'user_id', toColumn: 'id' }

const LoginUser = async (req: Request , res: Response, next: NextFunction) => {
  let id: any|undefined = req.body.user.id;
  let email: string|undefined = req.body.user.email;
  let password: string|undefined = req.body.user.password;
  let cartItems: CartItem[]|undefined = req.body.cartItems;
  
  id = parseInt(id);
  //get user from database
  let user: User | null; 
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
    //add cartItems to database
  let finalCartItems:CartItem[] = []
  //adjust and add cartItems
  if(passwordCheck && user.id){
    if (cartItems && cartItems.length && Array.isArray(cartItems)){
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
    } else {
      finalCartItems = await CartItemsModel.getSomeCartItems({user_id: user.id},undefined, undefined, {date:1})
      console.log('else passed')
    }
    console.log('before token')
  await CreateTokens(req, res, user);
  //send response user to client in response & response message
  res.status(Status.ACCEPTED).send({
    user: getResUser(user),
    cartItems: finalCartItems,
    message: 'Logged in successfully' });
  } else {
    res.status(Status.NOT_ACCEPTABLE).send({
      user: null,
      cartItems: await CartItemsModel.getSomeCartItems({user_id: user.id},undefined, undefined, {date:1}),
      message: 'Log in failed' 
    });
  }
    
};
export default LoginUser;
