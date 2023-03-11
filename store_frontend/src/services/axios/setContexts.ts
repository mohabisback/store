import addLocalStorage from '../../utils/addLocalStorage'
import { ExternalSignedUserReducer } from "../../contexts/SignedUserContext";
import { ExternalCartItemsReducer } from "../../contexts/CartItemsContext";
import { ExternalCategoriesReducer } from "../../contexts/CategoriesContext";
import {TyUser} from '@backend/users'
import { TyCartItem, TyCategory } from '@backend/store';

type Props = {
  signedUser:TyUser,
  cartItems: TyCartItem[],
  categories: TyCategory[]
}
const setContexts = ({signedUser, cartItems, categories}:Props) =>{
  if (typeof signedUser !== 'undefined') { //could be null
    console.log('signedUser was set from axios response', signedUser);
    //add response signedUser to SignedUserContext
    ExternalSignedUserReducer.dispatch({ type: 'SET_SIGNED_USER', payload: signedUser });
  }
  if (typeof cartItems !== 'undefined') { //could be null
    console.log('cartItems was set from axios response', cartItems);
    //add response signedUser to SignedUserContext
    ExternalCartItemsReducer.dispatch({ type: 'SET_CART_ITEMS', payload: cartItems });
  }
  if (typeof categories !== 'undefined') { //could be null
    console.log('categories was set from axios response', categories);
    //add response signedUser to SignedUserContext
    ExternalCategoriesReducer.dispatch({ type: 'SET_CATEGORIES', payload: categories });
  }
  addLocalStorage({signedUser, cartItems, categories})
}

export default setContexts