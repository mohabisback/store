import styled, {css} from 'styled-components'
import attrsHandler, {TyAttrs} from '../attrs/attrsHandler'

const cssH = css`
  display:flex; flex-flow:row nowrap;
  justify-content: flex-start; align-items: center;
  white-space: nowrap;
`
const gScale = (min:number, max:number, width: number) => (
  min + ((max-min)/(1440-375)*(width-375))
)

export const PxH1 = styled.h1.attrs<TyAttrs>(props=>{
  const gS = gScale (1.4, 2.2, props.theme.width)
  return {head:true, pxGenLevel: 0, pxGenScale: gS, pxGenFontScale: gS}})<TyAttrs>`
  
  ${cssH}; //common header props
  ${attrsHandler} //must be last, to override what in here
`

export const PxH2 = styled.h2.attrs<TyAttrs>(props=>{
  const gS = gScale (1.3, 1.9, props.theme.width)
  return {head: true, pxGenLevel: 0, pxGenScale: gS, pxGenFontScale: gS}})<TyAttrs>`
  ${cssH}; //common header props
  ${attrsHandler} //must be last, to override what in here
`
export const PxH3 = styled.h3.attrs<TyAttrs>(props=>{
  const gS = gScale (1.2, 1.5, props.theme.width)
  return {head: true, pxGenLevel: 0, pxGenScale: gS, pxGenFontScale: gS}})<TyAttrs>`

  ${cssH}; //common header props
  ${attrsHandler} //must be last, to override what in here
`
export const PxH4 = styled.h4.attrs<TyAttrs>(props=>{
  const gS = gScale (1.15, 1.3, props.theme.width)
  return {head: true, pxGenLevel: 0, pxGenScale: gS, pxGenFontScale: gS}})<TyAttrs>`

  ${cssH}; //common header props
  ${attrsHandler} //must be last, to override what in here
`
export const PxH5 = styled.h5.attrs<TyAttrs>(props=>{
  const gS = gScale (1.1, 1.2, props.theme.width)
  return {head: true, pxGenLevel: 0, pxGenScale: gS, pxGenFontScale: gS}})<TyAttrs>`
  
  ${cssH}; //common header props
  ${attrsHandler} //must be last, to override what in here
`
export const PxH6 = styled.h6.attrs<TyAttrs>(props=>{
  const gS = gScale (1.05, 1.1, props.theme.width)
  return {head: true, pxGenLevel: 0, pxGenScale: gS, pxGenFontScale: gS}})<TyAttrs>`

  ${cssH}; //common header props
  ${attrsHandler} //must be last, to override what in here
`

