import styled from 'styled-components'
import attrsHandler, {TyAttrs} from '../attrs/attrsHandler'

export default styled.button.attrs<TyAttrs>(props=>({
  pxGenLevel: 0,
  pxGenScale:1.1,
  pxGenFontScale: 1.1,
  button:true,
  type: 'button',
}))<TyAttrs>`${attrsHandler} //first attrsHandling

  display: flex; flex-direction: row;
  justify-content: center; align-items: center;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  -webkit-backface-visibility: hidden;
  outline: 0;
  :disabled {
    cursor: default;
    opacity: .8;
    box-shadow: none;
  }
`

