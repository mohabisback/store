import React, { createContext, useReducer } from 'react';
import { TyAttrs } from '../styles/attrs/attrsHandler';

export type TyCropperState = {
  show?: boolean,
  imgSrc?:string,
  aspect?:number,
  fileName?:string,
  file?:File,
}
type State = {
  cropperState: TyCropperState,

  openCropper:Function,
  setState:Function,
  closeCropper:Function
}

let initialState:State = {
  cropperState:{show: false},
  openCropper:()=>{},
  setState:()=>{},
  closeCropper:()=>{}
};

const CropperContext = createContext(initialState);

type Action = { type: string, payload?: State}
export const CropperContextReducer = (state:State, {type, payload}:Action):State => {
  switch (type) {
      case 'SHOW_CROPPER':
        return {
          ...state,
          cropperState:{...payload, show:true}
        };
      case 'SET_STATE':
        return {
          ...state,
          cropperState:{...state.cropperState, ...payload}
        };
      case 'HIDE_CROPPER':
        return {
          ...state,
          cropperState:{show:false}
        };
      default:
        return {
          ...state,
          cropperState:{show:false}
        };
  }
};

export const  CropperProvider = ({ children }:{children:React.ReactNode}) => {
  const [state, dispatch] = useReducer(CropperContextReducer, initialState);
  const value = {
    cropperState:state.cropperState,
    openCropper: (cropperState:State)=>{dispatch({type:'SHOW_CROPPER', payload:cropperState})},
    setState: (cropperState:State)=>{dispatch({type:'SET_STATE', payload:cropperState})},
    closeCropper: ()=>{dispatch({type:'HIDE_CROPPER'})}
  }

  return (
      // @ts-ignore
      <CropperContext.Provider value={value}>
          {children}
      </CropperContext.Provider>
  );
};

let resolveCallback:Function; //reference function which will refer to Promise.resolve()
export const useCropper = () => {

  const {cropperState, openCropper, setState, closeCropper} = React.useContext(CropperContext);

  const onOk = () => {
      closeCropper();
      resolveCallback(cropperState.file);
  };
  const onCancel = () => {
      closeCropper();
      resolveCallback(undefined);
  };
  const onNameChange = (fileName:string) =>{
    setState({fileName})
  }
  const onFileCreation = (file:File) => {
    setState({file})
  }
  const cropper = (imgSrc:string, aspect:number, fileName?:string):Promise<File|undefined> => {
    openCropper({imgSrc, aspect, fileName});
    return new Promise((resolve, reject) => {
        resolveCallback = resolve;
    });
  };

  return { cropper, onOk, onFileCreation, onNameChange, onCancel, openCropper, closeCropper, cropperState};
}
export default CropperContext