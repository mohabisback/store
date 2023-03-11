import React, { createContext, useReducer } from 'react';
import { ThemeProvider as ScThemeProvider } from 'styled-components';
import themeColors, {TyColor, TyCs} from '../styles/themes/themeColors'
import {themeConstructors, TyAllStyle} from '../styles/themes/themeStyles/default'
import c from '../styles/assets/colors';
import throttle from '../utils/evFunc/throttle';

export type TyTheme = {
  width:number, //auto
  height:number, //auto
  minPadding: number, //auto
  
  fontSize: number, //auto & user
  
  fontFactor: number, //user
  size: number, //user
  radius: number, //user
  color: TyColor, //user
  dark: string, //user
  group: string, //user
  name:string,
  style: TyAllStyle, //all styles constructed on theme change
}

type State = {
  theme: TyTheme, //supplied theme
  setThemeStyle: (themeName:string)=>void,
  setThemeColor: (colorName:string)=>void,
  setThemeDark: (dark:string)=>void,
  setThemeGroup: (group:string)=>void,
  setThemeSize: (size:number)=>void,
  setThemeRadius: (radius:number)=>void,
  setFontFactor: (fontFactor:number)=>void,
}

const notReady = ():void =>{}
const getFontSize = (w:number):number =>{
  //1440 max-screen-width, 375 min
  //21 max font, 7 min font
  return Math.round(14 + ( (21 - 14) / (1440 - 375) * (w - 375)))
}
const getMinPadding = (w:number):number =>{
  //1440 max-screen-width, 375 min
  //10 max padding, 4 min padding
  return Math.round(4 + ( (10 - 4) / (1440 - 375) * (w - 375)))
}
const heightToFont = 1.3;

const setInitialTheme = ():TyTheme=>{
  
  const localFontFactor: string|null = window.localStorage.getItem('fontFactor')
  let fontFactor: number = localFontFactor ? parseFloat(localFontFactor) : 1
  if (Number.isNaN(fontFactor)) fontFactor = 1
  
  const localSize: string|null = window.localStorage.getItem('size')
  let size: number = localSize ? parseFloat(localSize) : 1
  if (Number.isNaN(size)) size = 1
  size = size * heightToFont

  const localRadius: string|null = window.localStorage.getItem('radius')
  let radius: number = localRadius ? parseFloat(localRadius) : 20
  if (Number.isNaN(radius)) radius = 20
  
  const width = getWidth()
  
  const height = getHeight()
  
  const fontSize = getFontSize(width) * fontFactor
  const minPadding = getFontSize(width)

  const localDark:string|null = window.localStorage.getItem('dark')
  const dark:string = (localDark && localDark === 'dark') ? 'dark' : 'light'

  const localGroup:string|null = window.localStorage.getItem('group')
  const group:string = (localGroup && localGroup === 'group') ? 'group' : 'ungroup'

  const localColorName: string|null = window.localStorage.getItem('color')
  const colorName:string = localColorName ? localColorName : 'default' 
  const color = themeColors.find(v=>v.name===colorName) || themeColors[0]
  
  const localThemeName: string|null = window.localStorage.getItem('style')
  const name:string = localThemeName ? localThemeName : 'default'

  const themeConstructor = themeConstructors.find(v=>v.name === name) || themeConstructors[0]
  const style = themeConstructor.constructor((dark === 'dark') ? (color.colors.slice().reverse() as TyCs):color.colors)

  return {name, dark, color, width, height, fontSize,
    fontFactor, size, radius, minPadding, style, group}
}

const getWidth = ()=>(document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth)
const getHeight = ()=>(document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight)
  
//Changes are determined by comparing the new and old values using the same algorithm as Object.is.
export const initialState:State = {
  theme: setInitialTheme(),
  setThemeStyle: notReady,
  setThemeDark: notReady,
  setThemeGroup: notReady,
  setThemeColor: notReady,
  setThemeSize: notReady,
  setThemeRadius: notReady,
  setFontFactor: notReady,
};

//motor running with initial state
const ThemeContext = createContext(initialState);

type Action = {
  type: string,
  payload?: number|string
}
export const ThemeReducer = (state:State, action:Action):State => {
  const { type, payload } = action;

  let newState:State = {...state}
  switch (type) {
    //set theme
    case 'SET_STYLE':
      newState.theme.name = payload as string
      window.localStorage.setItem('style', payload as string)
      break;
    case 'SET_DARK':
      newState.theme.dark = payload as string
      window.localStorage.setItem('dark', payload as string)
      break;
    case 'SET_COLOR':
      newState.theme.color = themeColors.find(v=>v.name===payload) || themeColors[0]
      window.localStorage.setItem('color', payload as string)
      break;
    case 'SET_W_H_F_P':
      newState.theme.width = getWidth()
      newState.theme.height = getHeight()
      newState.theme.fontSize = getFontSize(newState.theme.width) * newState.theme.fontFactor
      newState.theme.minPadding = getMinPadding(newState.theme.width)
      break;
        
    case 'SET_SIZE':
      const size = (!payload) ? 1 : ((typeof payload === 'string') ? parseFloat(payload) : payload)
      window.localStorage.setItem('size', size.toString())
      newState.theme.size = size * heightToFont
      break;           
    case 'SET_RADIUS':
      const radius = (!payload) ? 1 : ((typeof payload === 'string') ? parseFloat(payload) : payload)
      window.localStorage.setItem('radius', radius.toString())
      newState.theme.radius = radius
      break;
    case 'SET_GROUP':
      newState.theme.group = payload as string
      window.localStorage.setItem('group', payload as string)
      break;
    case 'SET_FONT_FACTOR':
      const fontFactor = (!payload) ? 1 : ((typeof payload === 'string') ? parseFloat(payload) : payload)
      window.localStorage.setItem('fontFactor', fontFactor.toString())
      newState.theme.fontFactor = fontFactor
      newState.theme.fontSize = getFontSize(state.theme.width) * fontFactor
      break;
    default:
      break;
  }
  const constructor = themeConstructors.find(v=>v.name === newState.theme.name) || themeConstructors[0]
  const cs = (newState.theme.dark === 'dark') ? (newState.theme.color.colors.slice().reverse() as TyCs): (newState.theme.color.colors)
  newState.theme.style = constructor.constructor(cs)
  return newState;
};

export const ExternalThemeReducer = {
  isReady: false,
  //state: null,
  getState: () => {
    console.error('ExternalThemeReducer is NOT ready');
  },
  dispatch: (action:Action) => {
    console.error('ExternalThemeReducer is NOT ready');
  },
};

//The global telegram for the engineers
export const ThemeProvider = ({ children }:{children:React.ReactNode}) => {
  //connecting cables with reducer(engineers downstairs)
  const [state, dispatch] = useReducer(ThemeReducer, initialState);

  const stateRef = React.useRef(initialState);
  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);
  if (!ExternalThemeReducer.isReady) {
    ExternalThemeReducer.isReady = true;
    ExternalThemeReducer.getState = () => ({ ...stateRef.current });
    ExternalThemeReducer.dispatch = (params) => dispatch(params);
    Object.freeze(ExternalThemeReducer);
  }
  React.useEffect(()=>{
    window.addEventListener("load", (event) => {
      dispatch({ type: 'SET_W_H_F_P'})
    });
  },[])
  React.useEffect(() => {
    const handleResize = throttle(() => {
      dispatch({ type: 'SET_W_H_F_P'})
    }, 1000);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const providedValue:State = {
    theme: state.theme,
    setThemeStyle: (themeName:string) => {
      dispatch({ type: 'SET_STYLE', payload: themeName });
    },
    setThemeDark: (dark:string) => {
      dispatch({ type: 'SET_DARK', payload: dark });
    },
    setThemeColor: (colorName:string) => {
      dispatch({ type: 'SET_COLOR', payload: colorName });
    },
    setThemeSize: (size:number) => {
      dispatch({ type: 'SET_SIZE', payload: size });
    },
    setThemeRadius: (radius:number) => {
      dispatch({ type: 'SET_RADIUS', payload: radius });
    },    
    setThemeGroup: (group:string) => {
      dispatch({ type: 'SET_GROUP', payload: group });
    },
    setFontFactor: (fontFactor:number) => {
      dispatch({ type: 'SET_FONT_FACTOR', payload: fontFactor });
    }
  };

  //connecting cables with the captain
  return (
    <ThemeContext.Provider value={providedValue}>
      <ScThemeProvider theme={providedValue.theme}>
        {children}
      </ScThemeProvider>
    </ThemeContext.Provider> 
  )
};

export default ThemeContext;
