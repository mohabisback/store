import styled, { css, FlattenSimpleInterpolation } from "styled-components"
import { TyTheme } from "../../contexts/ThemeContext"
import themeColors, { TyCs } from "../themes/themeColors"
import { themeConstructors, TyAllStyle } from "../themes/themeStyles/default"
import {TyAttrs} from './attrsHandler'

export enum EnStyling {
  
  body = 'body', head = 'head',
  nav = 'nav',navItem = 'navItem',drop = 'drop',dropItem = 'dropItem',
  burger = 'burger',burgerItem = 'burgerItem',
  formBody = 'formBody', formLabel = 'formLabel',formInput = 'formInput',
  button = 'button',
  primaryHover = 'primaryHover', secondaryHover = 'secondaryHover', 
  primary = 'primary', secondary = 'secondary',
  borderThin = 'borderThin', shadow = 'shadow',
}
export type StylingProps = Partial<{[k in EnStyling]:boolean}>

const styling = (props:TyAttrs):FlattenSimpleInterpolation => {
  const stylingProps = Object.entries(EnStyling).filter(entry=>(entry[0] in props))
  let returning:FlattenSimpleInterpolation
  if (props.theme && (props.color || props.dark || props.light)) {
    
    const themeConstructor = themeConstructors.find(v=>v.name ===props.theme?.name) || themeConstructors[0]
    let color = (props?.color) ? themeColors.find(v=>v.name === (props?.color)) : undefined
    color = (color) ? color : (props.theme?.color || themeColors[0])
    const cs = (props.dark || ((props.theme.dark==='dark') && !props.light)) ?
      color.colors.slice().reverse() as TyCs : color.colors
    returning = stylingProps.reduce((reduced:FlattenSimpleInterpolation, entry)=>{
      return css`${reduced}
        ${themeConstructor[entry[0] as keyof TyAllStyle](cs)}
      `
    },css``)
    
  } else {
    returning = stylingProps.reduce((reduced:FlattenSimpleInterpolation, entry)=>{
      return css`${reduced}
        ${props.theme?.style[entry[0] as keyof TyAllStyle]}
      `
    },css``)
  }

  if (stylingProps.length > 0) {
  }
  return returning

}

export default styling