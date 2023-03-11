import styled from 'styled-components'
import attrsHandler, {TyAttrs} from '../attrs/attrsHandler'

export default styled.form.attrs<TyAttrs>(props=>({
  pxGenLevel: 1,
  formBody:true,
}))<TyAttrs>`${attrsHandler} //first attrsHandling

`

