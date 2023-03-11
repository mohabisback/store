import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
import attrsHandler, {TyAttrs} from '../attrs/attrsHandler'

export default styled(NavLink).attrs<TyAttrs>(props=>({
  //forwardedAs:NavLink, //as={NavLink} must be in the </> level
  pxLevel:0,
  pxGenScale:1.2,
  pxGenFontScale: 1.2,
  navItem:true
}))<TyAttrs>`${attrsHandler} //first attrsHandling

//for different contents of the link (icon & text)
display: flex; flex-direction: row;
justify-content: flex-start; align-items: center; 
white-space:pre;
transition: 0.5s;
:hover {
  transform: scale(1.1);
  z-index: 2;
}
`

