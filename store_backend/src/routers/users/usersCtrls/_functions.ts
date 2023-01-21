import { ErrAPI, Status } from '../../../ErrAPI';
import { EmailFormat, TyRef } from '../../../types/general';
import { TyCartItem, TmCartItem } from '../../../types/store';
import { TyUser } from '../../../types/users';
import adjustLoginCartItem from '../../store/cartItemsCtrls/adjustCartItem';
import { cleanObject } from '../../_functions';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

//import CartItemsModel from '../../../DB/mongoDB/store/CartItemsModel'; //mongoDB model
//import CartItemsModel from '../../../DB/pgDB/store/CartItemsModel' //pgDB model
const CartItemsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/CartItemsModel`).default;

const cartItemsRef: TyRef = { table: 'cartItems', projProps: {}, column: 'user_id', toColumn: 'id' };
export const getUserEmailOrId = async (params: any): Promise<TyUser> => {
  const { emailOrId } = params;
  const id = parseInt(emailOrId);
  //get user from database
  let user: TyUser | null;
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

export const setCartItemsForUser = async (
  user_id: number,
  cartItems?: TyCartItem[],
  newUser: boolean = false,
): Promise<TyCartItem[]> => {
  //add cartItems to database
  let finalCartItems: TyCartItem[] = [];

  if (cartItems && cartItems.length && Array.isArray(cartItems)) {
    //set defaults and add
    for (let item of cartItems) {
      const newItem: TyCartItem = cleanObject({ ...item }, TmCartItem); //, itemUnEditables);
      if (newItem.product_id && newItem.quantity) {
        try {
          finalCartItems = await adjustLoginCartItem(newItem.product_id, newItem.quantity, user_id);
        } catch (err) {
          console.log('Adding one cartItem failed.');
        }
      }
    }
  } else if (!newUser) {
    finalCartItems = await CartItemsModel.getManyCartItems({ user_id: user_id }, undefined, undefined, { date: 1 });
  }
  return finalCartItems;
};
