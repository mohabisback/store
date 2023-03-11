import styled from 'styled-components'
import attrsHandler, {TyAttrs} from '../attrs/attrsHandler'

export type {TyAttrs as TyStyleAttrs} from '../attrs/attrsHandler'
export default styled.div.attrs<TyAttrs>(props=>({...props,
  //first attrs modifying

}))<TyAttrs>`${attrsHandler} //first attrsHandling

`

