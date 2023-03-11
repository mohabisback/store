import { css, FlattenSimpleInterpolation } from "styled-components";
import { TyTheme } from "../../contexts/ThemeContext";
import scaling, { ScaleProps } from "./scaling";
import pxing, {PxingProps} from "./pxing";
import styling, {StylingProps} from './styling'

export type TyAttrs = {
  //adding new????? don't forget the ????????????????????????????????
  theme?:TyTheme, csss?:FlattenSimpleInterpolation[]
  pxTarget?:any, pxDepth?:number, color?:string, dark?:boolean, light?:boolean, pxGroup?:boolean,}& 
  ScaleProps & PxingProps & StylingProps;

export default css`
  ${(props:TyAttrs)=>{if(props.csss){
    const totalCss = props.csss.reduce<FlattenSimpleInterpolation>((reduced, value)=>(
      css`${reduced} 
      ${value}
      `),css``) 
    return totalCss
  }else{return ''}}}

  //px function, for levels, scale and fontScale, suppling min-height, radius, padding
  ${(props:TyAttrs)=>((props.theme) ? scaling(props.theme, props): '')}
  ${(props:TyAttrs)=>((props.theme) ? pxing(props.theme, props): '')}
  ${(props:TyAttrs)=>((props.theme) ? styling(props): '')}
`