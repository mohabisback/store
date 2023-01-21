import React, { createContext, useReducer } from 'react';
import CategoriesDS from '../../services/axios/CategoriesDS';

//Changes are determined by comparing the new and old values using the same algorithm as Object.is.
export const initialState = {
  categories: JSON.parse(window.localStorage.getItem('categories')),
};

//motor running with initial state
const CategoriesContext = createContext(initialState);

//downstairs engineers for the motor state
//Engineers need the present state & action to do
//The action they do includes type & a package if any
export const CategoriesReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    //set categories
    case 'SET_CATEGORIES':
      return {
        categories: [ ...payload ], //copy of the categories, not the response object
      };
    default:
      return state;
  }
};

export const ExternalCategoriesReducer = {
  isReady: false,
  //state: null,
  getState: () => {
    console.error('ExternalCategoriesReducer is NOT ready');
  },
  dispatch: () => {
    console.error('ExternalCategoriesReducer is NOT ready');
  },
};

//The global telegram for the engineers
export const CategoriesContextProvider = ({ children }) => {
  //connecting cables with reducer(engineers downstairs)
  const [state, dispatch] = useReducer(CategoriesReducer, initialState);

  const stateRef = React.useRef(initialState);
  React.useEffect(() => {
    stateRef.current = state;
    //ExternalCategoriesReducer.state = state
  }, [state]);
  if (!ExternalCategoriesReducer.isReady) {
    ExternalCategoriesReducer.isReady = true;
    //ExternalCategoriesReducer.state = state
    ExternalCategoriesReducer.getState = () => ({ ...stateRef.current });
    ExternalCategoriesReducer.dispatch = (params) => dispatch(params);
    Object.freeze(ExternalCategoriesReducer);
  }

  //two types of data between captain and engineers
  const providedValue = {
    //information from engineers to captain, about the motor state
    categories: state.categories,
    //orders from captain to engineers, about how will be the motor state
    setCategories: (categories) => {
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    },
  };

  //initial requests
  React.useEffect(()=>{
    //don't await
    CategoriesDS.getMany()
  },[])

  //connecting cables with the captain
  return <CategoriesContext.Provider value={providedValue}>{children}</CategoriesContext.Provider>;
};

export default CategoriesContext;
