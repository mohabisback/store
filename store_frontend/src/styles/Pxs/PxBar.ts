import styled, {css} from 'styled-components'
import {NavLink} from 'react-router-dom'
import attrsHandler, {TyAttrs} from '../attrs/attrsHandler'
import pxing from '../attrs/pxing'
import scaling from '../attrs/scaling'

export default styled.ul.attrs<TyAttrs>(props=>({
  pxGenLevel:1,
  pxPadding:0.2, pxFlexGap:0.2,
  pxMarginRight:0.5,
  nav:true
}))<TyAttrs>` //first attrsHandling
  ${attrsHandler}
  flex: none;

  height: 100%;
  min-height: 100%;
  display: flex; flex-flow: row nowrap; //flow=direction+wrap
  justify-content: flex-start; align-items: center;
  
  > li {
    ${({theme})=>(scaling(theme, {pxLevel:1}))}
    ${({theme})=>(pxing(theme, {pxPadding: 0}))}
    height:100%;
    display: flex; flex-direction: row;
    justify-content: flex-start; align-items: center;
    position:relative; //for next dropdowns
  }
  ${({theme})=>{
    if (theme.group === 'group') return css`
    > li:first-child:not(:last-child){
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      >a, >button, >input, >label {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
    }
    > li:not(:first-child):not(:last-child){
      border-radius: 0px;
      >a, >button, >input, >label {
        border-radius: 0px;
      }
    }
    > li:last-child:not(:first-child) {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      >a, >button, >input, >label {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      }
    }
    `
    return css``
  }}
`

