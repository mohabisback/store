import React, { createContext, useReducer } from 'react';
import {TyCartItem} from '@backend/store'

type State = {
  cartItems: TyCartItem[],
  cartItemsCount: number,
  setCartItems: Function,
  addCartItem: Function
}
type Action = {
  type: string,
  payload: TyCartItem[]|TyCartItem
}
const getLocalStorage = ():TyCartItem[] => {
  const local: string|null = window.localStorage.getItem('cartItems')
  return local ? (JSON.parse(local) as TyCartItem[]) : []
}
const notReady = () =>{}
//Changes are determined by comparing the new and old values using the same algorithm as Object.is.
export const initialState:State = {
  cartItems: getLocalStorage(),
  cartItemsCount: 0,
  setCartItems: notReady,
  addCartItem: notReady,
};

//motor running with initial state
const CartItemsContext = createContext(initialState);

//downstairs engineers for the motor state
//Engineers need the present state & action to do
//The action they do includes type & a package if any
export const CartItemsReducer = (state:State, action:Action) => {
  const { type, payload } = action;
  switch (type) {
    //set cartItems
    case 'SET_CART_ITEMS':
      //new state returned
      if (Array.isArray(payload)){
        return {
          ...state,
          cartItems: [...payload], //copy of the cartItems, not the response object
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};


const getCartItemsCount = (cartItems:TyCartItem[]) => {
  let count = 0;
  if (cartItems && Array.isArray(cartItems)) {
    for (let i of cartItems) {
      if (i && i.quantity && Number.isInteger(i.quantity)) {
        count += i.quantity;
      }
    }
  } else {}
  return count;
};

export const ExternalCartItemsReducer = {
  isReady: false,
  //state: null,
  getState: () => {
    console.error('ExternalCartItemsReducer is NOT ready');
  },
  dispatch: (action:Action) => {
    console.error('ExternalCartItemsReducer is NOT ready');
  },
};
//The global telegram for the engineers
export const CartItemsProvider = ({ children }:{children:React.ReactNode}) => {
  //give the engineers the capability to execute jobs on motor
  //tell the context to execute whatever the reducer do in the state
  const [state, dispatch] = useReducer(CartItemsReducer, initialState);

  const stateRef = React.useRef(initialState);
  React.useEffect(() => {
    stateRef.current = state;
    //ExternalCartItemsReducer.state = state
  }, [state]);
  if (!ExternalCartItemsReducer.isReady) {
    ExternalCartItemsReducer.isReady = true;
    //ExternalCartItemsReducer.state = state
    ExternalCartItemsReducer.getState = () => ({ ...stateRef.current });
    ExternalCartItemsReducer.dispatch = (action:Action) => dispatch(action);
    Object.freeze(ExternalCartItemsReducer);
  }

  //two types of data between captain and engineers
  const providedValue:State = {
    //information from engineers to captain, about the motor state
    cartItems: state.cartItems,
    cartItemsCount: getCartItemsCount(state.cartItems),
    //orders from captain to engineers, about how will be the motor state
    setCartItems: (cartItems:TyCartItem[]) => {
      dispatch({ type: 'SET_CART_ITEMS', payload: cartItems });
    },
    addCartItem: (cartItem:TyCartItem) => {
      dispatch({ type: 'ADD_CART_ITEM', payload: cartItem });
    },
  };

  //initial requests
  React.useEffect(()=>{
    //don't await
    //CartItemsDS.getMany()
  },[])
  //connecting cables with the captain
  return <CartItemsContext.Provider
    value={providedValue}
  >{children}
  </CartItemsContext.Provider>;
};

export default CartItemsContext;
