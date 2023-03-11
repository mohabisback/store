import React, { createContext, useReducer } from 'react';

export type TyZoomState = {
  show?: boolean,

  ev?:  React.MouseEvent<HTMLElement, MouseEvent>,
  bodyText?: string,
  headText?: string,
  delay?: number,
  
  customJSX?: React.ReactNode,
}
type State = {
  zoomState: TyZoomState,

  showZoom:Function,
  hideZoom:Function
}

let initialState:State = {
  zoomState:{show: false, delay: 1000,},
  
  showZoom:()=>{},
  hideZoom:()=>{}
};

const ZoomContext = createContext(initialState);

type Action = { type: string, payload?: State}
export const ZoomContextReducer = (state:State, {type, payload}:Action):State => {
  switch (type) {
      case 'SHOW_ZOOM':
        const newState = {
          ...state,
          zoomState:{...payload, show:true}
        };
        return newState
      case 'HIDE_ZOOM':
        return initialState;
      default:
        return initialState;
  }
};

export const  ZoomProvider = ({ children }:{children:React.ReactNode}) => {
  const [state, dispatch] = useReducer(ZoomContextReducer, initialState);
  const value = {
    zoomState:state.zoomState,
    showZoom: (zoomState:State)=>{dispatch({type:'SHOW_ZOOM', payload:zoomState})},
    hideZoom: ()=>{dispatch({type:'HIDE_ZOOM'})}
  }

  return (
      // @ts-ignore
      <ZoomContext.Provider value={value}>
          {children}
      </ZoomContext.Provider>
  );
};

export enum EnZoomResponse {
  yes = 'yes',
  no = 'no', 
  cancel = 'cancel'
}


export function useZoom() {//mustttt be used because of portal (value not provided)

  const {zoomState , showZoom, hideZoom} = React.useContext(ZoomContext);
  const show = (payload:TyZoomState) =>{
    showZoom(payload)

  }

  return { showZoom, hideZoom, zoomState, show };
}
export default ZoomContext;