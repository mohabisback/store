import React, { createContext, useReducer } from 'react';

export const initialState = {
  show: false,
  text: '',
  okText: 'Ok',
  cancelText: 'Cancel'
};

const DialogContext = createContext(initialState);

export const DialogContextReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
      case 'SHOW_DIALOG':
          return {
              show: true,
              text: payload.text,
              okText: payload.okText,
              cancelText: payload.cancelText
          };
      case 'HIDE_DIALOG':
          return initialState;
      default:
          return initialState;
  }
};

export const  DialogContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(DialogContextReducer, initialState);

  return (
      <DialogContext.Provider value={[state, dispatch]}>
          {children}
      </DialogContext.Provider>
  );
};




let resolveCallback; //reference function which will refer to Promise.resolve()
export function useDialog() {
  const [dialogState, dispatch] = React.useContext(DialogContext);

  const onOk = () => {
      closeDialog();
      resolveCallback(true);
  };

  const onCancel = () => {
      closeDialog();
      resolveCallback(false);
  };

  const dialog = (text, okText, cancelText) => {
      dispatch({
          type: 'SHOW_DIALOG',
          payload: {
              text,
              okText,
              cancelText
          }
      });
      return new Promise((resolve, reject) => {
          resolveCallback = resolve;
      });
  };

  const closeDialog = () => {
      dispatch({
          type: 'HIDE_DIALOG'
      });
  };

  return { dialog, onOk, onCancel, dialogState };
}

export default DialogContext;