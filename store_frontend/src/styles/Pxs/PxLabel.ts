import styled from 'styled-components'
import attrsHandler, {TyAttrs} from '../attrs/attrsHandler'

export default styled.label.attrs<TyAttrs>(props=>({
  as:'label', //will overlap <button as={}>, to overlap it use extended.attrs()
  pxGenLevel: 0,
  formLabel:true,
}))<TyAttrs>`${attrsHandler} //first attrsHandling

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

