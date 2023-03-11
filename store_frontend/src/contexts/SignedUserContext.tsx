import React, { createContext, useReducer } from 'react';
import {TyUser} from '@backend/users'

type State = {
  signedUser: TyUser|null,
  setSignedUser:Function
}
type Action = {
  type: string,
  payload: TyUser
}
const getLocalStorage = ():TyUser|null => {
  const local: string|null = window.localStorage.getItem('signedUser')
  return local ? (JSON.parse(local) as TyUser) : null
}
//Changes are determined by comparing the new and old values using the same algorithm as Object.is.
export const initialState:State = {
  signedUser: getLocalStorage(),
  setSignedUser: ()=>{}
};


//motor running with initial state
const SignedUserContext = createContext(initialState);

//downstairs engineers for the motor state
//Engineers need the present state & action to do
//The action they do includes type & a package if any
export const SignedUserReducer = (state:State, action:Action) => {
  const { type, payload } = action;
  switch (type) {
    //set signedUser
    case 'SET_SIGNED_USER':
      return {
        ...state,
        signedUser: { ...payload }, //copy of the signedUser, not the response object
      };
    default:
      return state;
  }
};

export const ExternalSignedUserReducer = {
  isReady: false,
  //state: null,
  getState: () => {
    console.error('ExternalSignedUserReducer is NOT ready');
  },
  dispatch: (action:Action) => {
    console.error('ExternalSignedUserReducer is NOT ready');
  },
};

//The global telegram for the engineers
export const SignedUserProvider = ({ children }:{children:React.ReactNode}) => {
  //connecting cables with reducer(engineers downstairs)
  const [state, dispatch] = useReducer(SignedUserReducer, initialState);

  const stateRef = React.useRef(initialState);
  React.useEffect(() => {
    stateRef.current = state;
    //ExternalSignedUserReducer.state = state
  }, [state]);
  if (!ExternalSignedUserReducer.isReady) {
    ExternalSignedUserReducer.isReady = true;
    //ExternalSignedUserReducer.state = state
    ExternalSignedUserReducer.getState = () => ({ ...stateRef.current });
    ExternalSignedUserReducer.dispatch = (params) => dispatch(params);
    Object.freeze(ExternalSignedUserReducer);
  }

  //two types of data between captain and engineers
  const providedValue = {
    //information from engineers to captain, about the motor state
    signedUser: state.signedUser,
    //orders from captain to engineers, about how will be the motor state
    setSignedUser: (signedUser:TyUser) => {
      dispatch({ type: 'SET_SIGNED_USER', payload: signedUser });
    },
  };

  //connecting cables with the captain
  return <SignedUserContext.Provider value={providedValue}>
    {children}
    </SignedUserContext.Provider>;
};

export default SignedUserContext;
