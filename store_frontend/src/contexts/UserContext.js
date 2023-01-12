import React, { createContext, useReducer } from 'react';

//Changes are determined by comparing the new and old values using the same algorithm as Object.is.
export const initialState = {
  user: {...JSON.parse(window.localStorage.getItem('user'))}
}

//motor running with initial state
const UserContext = createContext(initialState);

//downstairs engineers for the motor state
//Engineers need the present state & action to do
//The action they do includes type & a package if any
export const UserReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
      //set user
      case 'SET_USER':
        return {
          user: {...payload} //copy of the user, not the response object
        }
    default:
      return state;
  }
}

export const ExternalUserReducer = {
  isReady: false,
  //state: null,
  getState: () => {console.error('ExternalUserReducer is NOT ready')},
  dispatch: () => {console.error('ExternalUserReducer is NOT ready')},
}

//The global telegram for the engineers
export const UserProvider = ({ children }) => {
  //connecting cables with reducer(engineers downstairs)
  const [state, dispatch] = useReducer(UserReducer, initialState);

  const stateRef = React.useRef(initialState)
  React.useEffect(() => {
    stateRef.current = state
    //ExternalUserReducer.state = state
  }, [state])
  if (!ExternalUserReducer.isReady) {
    ExternalUserReducer.isReady = true
    //ExternalUserReducer.state = state
    ExternalUserReducer.getState = () => ({...stateRef.current})
    ExternalUserReducer.dispatch = params => dispatch(params)
    Object.freeze(ExternalUserReducer)
  }

  //two types of data between captain and engineers
  const providedValue = {
    //information from engineers to captain, about the motor state
    user: state.user,
    //orders from captain to engineers, about how will be the motor state
    setUser: (user) => {dispatch({type: 'SET_USER', payload: user}); }, 
  }

  //connecting cables with the captain
  return (
    <UserContext.Provider value={providedValue}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext;