import React, { createContext, useReducer } from 'react';

//Changes are determined by comparing the new and old values using the same algorithm as Object.is.
export const initialState = {
  signedUser: { ...JSON.parse(window.localStorage.getItem('signedUser')) },
};

//motor running with initial state
const SignedUserContext = createContext(initialState);

//downstairs engineers for the motor state
//Engineers need the present state & action to do
//The action they do includes type & a package if any
export const SignedUserReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    //set signedUser
    case 'SET_SIGNED_USER':
      return {
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
  dispatch: () => {
    console.error('ExternalSignedUserReducer is NOT ready');
  },
};

//The global telegram for the engineers
export const SignedUserContextProvider = ({ children }) => {
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
    setSignedUser: (signedUser) => {
      dispatch({ type: 'SET_SIGNED_USER', payload: signedUser });
    },
  };

  //connecting cables with the captain
  return <SignedUserContext.Provider value={providedValue}>
    {children}
    </SignedUserContext.Provider>;
};

export default SignedUserContext;
