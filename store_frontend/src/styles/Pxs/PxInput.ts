import styled from 'styled-components'
import attrsHandler, { TyAttrs } from '../attrs/attrsHandler'

export default styled.input.attrs<TyAttrs>(props=>({
  pxGenLevel: 0,
  formInput:true,
}))<TyAttrs>`${attrsHandler} //first attrsHandling
  overflow: hidden;
  text-align: start;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  -webkit-backface-visibility: hidden;
  outline: 0;
  :disabled {
    opacity: .8;
    box-shadow: none;
  } 
`

