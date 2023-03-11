import React, { createContext, useReducer } from 'react';
import { TyAttrs } from '../styles/attrs/attrsHandler';

export type TyDialogState = {
  show?: boolean,
  bodyText?: string,
  attrs?: TyAttrs,
  bodyAttrs?: TyAttrs,
  headText?: string,
  headAttrs?: TyAttrs,
  yesText?: string,
  yesAttrs?: TyAttrs,
  noText?: string,
  noAttrs?: TyAttrs,
  cancelText?: string,
  cancelAttrs?: TyAttrs,
}
type State = {
  dialogState: TyDialogState,

  openDialog:Function,
  closeDialog:Function
}

let initialState:State = {
  dialogState:{show: false},
  openDialog:()=>{},
  closeDialog:()=>{}
};

const DialogContext = createContext(initialState);

type Action = { type: string, payload?: State}
export const DialogContextReducer = (state:State, {type, payload}:Action):State => {
  switch (type) {
      case 'SHOW_DIALOG':
        return {
          ...state,
          dialogState:{...payload, show:true}
        };
      case 'HIDE_DIALOG':
        return {
          ...state,
          dialogState:{show:false}
        };
      default:
        return {
          ...state,
          dialogState:{show:false}
        };
  }
};

export const  DialogProvider = ({ children }:{children:React.ReactNode}) => {
  const [state, dispatch] = useReducer(DialogContextReducer, initialState);
  const value = {
    dialogState:state.dialogState,
    openDialog: (dialogState:State)=>{dispatch({type:'SHOW_DIALOG', payload:dialogState})},
    closeDialog: ()=>{dispatch({type:'HIDE_DIALOG'})}
  }

  return (
      // @ts-ignore
      <DialogContext.Provider value={value}>
          {children}
      </DialogContext.Provider>
  );
};

export enum EnDialogResponse {
  yes = 'yes',
  no = 'no', 
  cancel = 'cancel'
}

let resolveCallback:Function; //reference function which will refer to Promise.resolve()
export const useDialog = () => {

  const {dialogState, openDialog, closeDialog} = React.useContext(DialogContext);

  const onYes = () => {
      closeDialog();
      resolveCallback(EnDialogResponse.yes);
  };
  const onNo = () => {
      closeDialog();
      resolveCallback(EnDialogResponse.no);
  };
  const onCancel = () => {
      closeDialog();
      resolveCallback(EnDialogResponse.cancel);
  };

  const dialog = (payload:TyDialogState):Promise<EnDialogResponse> => {
    openDialog(payload);
    return new Promise((resolve, reject) => {
        resolveCallback = resolve;
    });
  };

  return { dialog, onYes, onNo, onCancel, openDialog, closeDialog, dialogState};
}
export default DialogContext