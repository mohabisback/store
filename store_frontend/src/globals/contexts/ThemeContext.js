import React, { createContext, useReducer } from 'react';
import defaultTheme from '../styles/themes/defaultTheme.js';

//Changes are determined by comparing the new and old values using the same algorithm as Object.is.
export const initialState = {
  theme: JSON.parse(window.localStorage.getItem('theme')) || defaultTheme,
};

//motor running with initial state
const ThemeContext = createContext(initialState);

//downstairs engineers for the motor state
//Engineers need the present state & action to do
//The action they do includes type & a package if any
export const ThemeReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    //set theme
    case 'SET_THEME':
      return {
        theme: { ...payload }, //copy of the theme, not the response object
      };
    default:
      return state;
  }
};

export const ExternalThemeReducer = {
  isReady: false,
  //state: null,
  getState: () => {
    console.error('ExternalThemeReducer is NOT ready');
  },
  dispatch: () => {
    console.error('ExternalThemeReducer is NOT ready');
  },
};

//The global telegram for the engineers
export const ThemeContextProvider = ({ children }) => {
  //connecting cables with reducer(engineers downstairs)
  const [state, dispatch] = useReducer(ThemeReducer, initialState);

  const stateRef = React.useRef(initialState);
  React.useEffect(() => {
    stateRef.current = state;
    //ExternalThemeReducer.state = state
  }, [state]);
  if (!ExternalThemeReducer.isReady) {
    ExternalThemeReducer.isReady = true;
    //ExternalThemeReducer.state = state
    ExternalThemeReducer.getState = () => ({ ...stateRef.current });
    ExternalThemeReducer.dispatch = (params) => dispatch(params);
    Object.freeze(ExternalThemeReducer);
  }

  //two types of data between captain and engineers
  const providedValue = {
    //information from engineers to captain, about the motor state
    theme: state.theme,
    //orders from captain to engineers, about how will be the motor state
    setTheme: (theme) => {
      dispatch({ type: 'SET_THEME', payload: theme });
    },
  };

  //connecting cables with the captain
  return <ThemeContext.Provider value={providedValue}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
