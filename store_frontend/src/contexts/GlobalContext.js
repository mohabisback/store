import React, { createContext, useReducer } from 'react';
import socket from '../services/socket/socket.js';
//Changes are determined by comparing the new and old values using the same algorithm as Object.is.

//initial info for motor state
export const initialState = {
  loading: false,
  socket: socket,
  user: {...JSON.parse(window.localStorage.getItem('user'))},
  globalArray1: [],
  globalObject1: {}
}

//motor running with initial state
const GlobalContext = createContext(initialState);

//downstairs engineers for the motor state
//Engineers need the present state & action to do
//The action they do includes type & a package if any
export const GlobalReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    //add an item to globalArray1
    case 'ADD_ARRAY1':
      return {
        globalArray1: [...state.globalArray1, payload]
      }

    //remove an item from globalArray1
    case 'REM_ARRAY1':
      return {
        globalArray1: state.globalArray1.filter(item => item !== payload)
      }

    //update object item in globalArray1 by id
    case 'UPD_ARRAY1_ID':
      return {
        globalArray1: state.globalArray1.map((obj) => {
                        if (obj.id === payload.id) {
                          return { ...obj, payload };
                        } else {
                          return obj;
                        }
                      })
      }

    //update object item in globalArray1 by name
    case 'UPD_ARRAY1_NAME':
      return {
        globalArray1: state.globalArray1.map((obj) => {
                        if (obj.name === payload.name) {
                          return { ...obj, payload };
                        } else {
                        return obj;
                        }
                      })
      }
      
      //add/update properties to globalObject1
      //payload is an obj with properties to be added {a:1, b:'c'}
      case 'ADD_OBJ1':
        return {
          globalObject1: {...state.globalObject1, ...payload}
        }

      //needs revision
      //remove a property from globalObject1
      //payload is property key
      case 'REM_OBJ1':
        const newGlobalObj1 = state.globalObject1;
        delete newGlobalObj1[payload];
        return {
          globalObject1: newGlobalObj1
        }
      
      //set user
      case 'SET_USER':
        return {
          user: {...payload} //copy of the user, not the response object
        }
        //connect
        case 'SOCKET_CONNECT':         
          return {
            socket: state.socket.connect()
        }
      //set loading
      case 'SET_LOADING':
        return {
          loading: payload
        }
    default:
      return state;
  }
}

export const ExternalReducer = {
  isReady: false,
  //state: null,
  getState: () => {console.error('ExternalReducer is NOT ready')},
  dispatch: () => {console.error('ExternalReducer is NOT ready')},
}

//The global telegram for the engineers
export const GlobalProvider = ({ children }) => {
  //connecting cables with reducer(engineers downstairs)
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  const stateRef = React.useRef(initialState)
  React.useEffect(() => {
    stateRef.current = state
    //ExternalReducer.state = state
  }, [state])
  if (!ExternalReducer.isReady) {
    ExternalReducer.isReady = true
    //ExternalReducer.state = state
    ExternalReducer.getState = () => ({...stateRef.current})
    ExternalReducer.dispatch = params => dispatch(params)
    Object.freeze(ExternalReducer)
  }

  //two types of data between captain and engineers
  const providedValue = {
    //information from engineers to captain, about the motor state
    loading: state.loading,
    user: state.user,
    socket: state.socket,
    globalArray1: state.globalArray1,
    globalObject1: state.globalObject1,
    //orders from captain to engineers, about how will be the motor state
    addToArray1: (item) => { dispatch({ type: 'ADD_ARRAY1', payload: item }); },
    removeFromArray1: (item) => { dispatch({ type: 'REM_ARRAY1', payload: item }); },
    updateObjInArray1byID: (obj) => { dispatch({ type: 'UPD_ARRAY1_ID', payload: obj }); },
    updateObjInArray1byName: (obj) => { dispatch({ type: 'UPD_ARRAY1_NAME', payload: obj }); },
    addToObject1: (property) => { dispatch({ type: 'ADD_OBJ1', payload: property }); },
    removeFromObject1: (propertyKey) => { dispatch({ type: 'REM_OBJ1', payload: propertyKey }); },
    setUser: (user) => {dispatch({type: 'SET_USER', payload: user}); },
    socketConnect: (socket) => {dispatch({type: 'SOCKET_CONNECT', payload: null});},  
    setLoading: (loading) => {dispatch({type: 'SET_LOADING', payload: loading}); },  
  }

  //connecting cables with the captain
  return (
    <GlobalContext.Provider value={providedValue}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalContext;