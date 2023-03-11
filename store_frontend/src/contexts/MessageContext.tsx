import React, { createContext, useReducer } from 'react';
import { TyAttrs } from '../styles/attrs/attrsHandler';
const delay = 3000;
export let messageTimeout:NodeJS.Timeout;


export type TyMessageState = {
  show?: boolean,
  bodyText?: string,
  headText?: string,
  delay?: number,
  bodyAttrs?: TyAttrs,
  headAttrs?: TyAttrs,
  attrs?:TyAttrs,
  customJSX?: React.ReactNode,
}
type State = {
  messageState: TyMessageState,
  message:Function,
  hideMessage:Function,
}

let initialState:State = {
  messageState:{show: false, delay,},
  message:()=>{},
  hideMessage:()=>{},
};

const MessageContext = createContext(initialState);

type Action = { type: string, payload?: TyMessageState}
export const MessageContextReducer = (state:State, {type, payload}:Action):State => {
  let newState: State;
  switch (type) {
      case 'SHOW_MESSAGE':
        newState = {
          ...state,
          messageState:{...state.messageState, ...payload, show:true}
        };
        break;
      case 'HIDE_MESSAGE':
        newState = {...state,
        messageState:{...state.messageState, show:false}}
        break;
      default:
        return state;
  }
  return newState
};

export const  MessageProvider = ({ children }:{children:React.ReactNode}) => {
  const [state, dispatch] = useReducer(MessageContextReducer, initialState);
  
  const value = {
    messageState:state.messageState,
    message: (
      bodyText?:string,
      headText?:string,
      attrs?:{},
      bodyAttrs?:{},
      headAttrs?:{},
      customJSX?:React.ReactNode
    )=>{dispatch({type:'SHOW_MESSAGE', payload:{bodyText, headText, attrs, bodyAttrs, headAttrs, customJSX}})},
    hideMessage: ()=>{dispatch({type:'HIDE_MESSAGE'})},
  }

  return (
      // @ts-ignore
      <MessageContext.Provider value={value}>
          {children}
      </MessageContext.Provider>
  );
};

export enum EnMessageResponse {
  yes = 'yes',
  no = 'no', 
  cancel = 'cancel'
}


export function useMessage() {//mustttt be used because of portal (value not provided)

  const {messageState , message, hideMessage} = React.useContext(MessageContext);
  const show = (payload:TyMessageState) =>{
    message(payload)
  }

  return { message, hideMessage, messageState, show };
}
export default MessageContext;