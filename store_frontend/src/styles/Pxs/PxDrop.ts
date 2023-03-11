import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
import attrsHandler, {TyAttrs} from '../attrs/attrsHandler'
import pxing from '../attrs/pxing'

export default styled.ul.attrs<TyAttrs>(props=>({
  //forwardedAs:NavLink, //as={NavLink} must be in the </> level
  pxGenLevel:1,
  pxPadding:0.2, pxFlexGap:0.2,
  drop:true,
}))<TyAttrs>` //first attrsHandling
  
  ${({theme, pxDepth, pxTarget})=>{
    if(!pxDepth) pxDepth = 0;
    let cssStr:string = `
    z-index: ${pxDepth + 2};`
    const rect = pxTarget?.getBoundingClientRect()
    
    if (pxDepth === 0){
      if (rect && rect.top >= (theme.height-rect.bottom)){
        cssStr += `
        bottom: 99%;`
      } else {
        cssStr += `
        top: 99%;`
      }
      if (rect && rect.left >= (theme.width-rect.right)){
        cssStr += `
        right: 0%;`
      } else {
        cssStr += `
        left: 0%;`
      }
    } else {
      if (rect && rect.left >= (theme.width-rect.right)){
        cssStr += `
        right: 99%;`
      } else {
        cssStr += `
        left: 99%;`
      }
      if (rect && rect.top >= (theme.height-rect.bottom)){
        cssStr += `
        bottom: 0%;`
      } else {
        cssStr += `
        top: 0%;`
      }
    }
    return cssStr;
  }}
  display: flex; flex-flow: column nowrap; //flow=direction+wrap
  justify-content: flex-start; align-items: stretch;
  
  position: absolute;
  pointer-events: auto;
  transition: 0.5s;

  > li {
    display: flex; flex-flow: column nowrap; //flow=direction+wrap
    justify-content: center; align-items: stretch;
    
    position:relative; //for next dropdowns
  }
  ${attrsHandler};
`

