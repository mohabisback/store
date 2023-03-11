import React, { createContext, useReducer } from 'react';
import { TyAttrs } from '../styles/attrs/attrsHandler';
const delay = 1000
export type TyTooltipState = {
  show?: boolean,
  ev?:  React.MouseEvent<HTMLElement, MouseEvent>,
  bodyText?: string,
  headText?: string,
  attrs?: TyAttrs,
  delay?: number,
  bodyAttrs?: TyAttrs,
  headAttrs?: TyAttrs,
  customJSX?: React.ReactNode,
}
type State = {
  tooltipState: TyTooltipState,
  hideTooltip:Function,
  tooltip:Function
}

let initialState:State = {
  tooltipState:{show: false, delay,},
  hideTooltip:()=>{},
  tooltip:()=>{},
};

const TooltipContext = createContext(initialState);

type Action = { type: string, payload?: TyTooltipState}
export const TooltipContextReducer = (state:State, {type, payload}:Action):State => {
  let newState: State;
  switch (type) {
      case 'SHOW_TOOLTIP':
         newState = {...state,
          tooltipState:{...state.tooltipState, ...payload, show:true}
        };
        break;
      case 'HIDE_TOOLTIP':
        newState = {...state,
        tooltipState:{...state.tooltipState, show:false}}
        break;
      default:
        return state;
  }
  return newState
};

export const  TooltipProvider = ({ children }:{children:React.ReactNode}) => {
  const [state, dispatch] = useReducer(TooltipContextReducer, initialState);
  const value = {
    tooltipState:state.tooltipState,
    hideTooltip: ()=>{dispatch({type:'HIDE_TOOLTIP'})},
    tooltip: (
      ev:any,
      bodyText?:string,
      headText?:string,
      attrs?:{},
      bodyAttrs?:{},
      headAttrs?:{},
      customJSX?:React.ReactNode
      )=>{
        setTimeout(()=>{
          dispatch({type:'SHOW_TOOLTIP', payload:{ev, bodyText, headText, attrs, bodyAttrs, headAttrs, customJSX}})
        }, delay)
      },
  }

  return (
      // @ts-ignore
      <TooltipContext.Provider value={value}>
          {children}
      </TooltipContext.Provider>
  );
};

export enum EnTooltipResponse {
  yes = 'yes',
  no = 'no', 
  cancel = 'cancel'
}


export function useTooltip() {//mustttt be used because of portal (value not provided)

  const {tooltipState , tooltip, hideTooltip} = React.useContext(TooltipContext);


  return { tooltip, hideTooltip, tooltipState };
}
export default TooltipContext;