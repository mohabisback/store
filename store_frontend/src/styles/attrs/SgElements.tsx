import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import attrs, { TyAttrs } from './attrsHandler'

//theme dependent  

export const SgDiv = styled.div<TyAttrs>`${attrs}`
export const SgForm = styled.form<TyAttrs>`${attrs}`
export const SgLabel = styled.label<TyAttrs>`${attrs}`
export const SgInput = styled.input<TyAttrs>`${attrs}`
export const SgNavLink = styled(NavLink)<TyAttrs>`${attrs}`