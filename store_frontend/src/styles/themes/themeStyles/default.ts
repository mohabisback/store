import {css, FlattenSimpleInterpolation} from 'styled-components'
import themeColors, {TyCs} from '../themeColors'
import { EnStyling
 } from '../../attrs/styling';
type s = string;
type c = FlattenSimpleInterpolation;

export type TyAllStyle = {[k in EnStyling]:c}
export type TyAllStyleFn = (cs:TyCs) =>TyAllStyle

type TyOneStyleFn = (cs:TyCs) =>c

const primary:TyOneStyleFn = (cs) => {
  const gr = `linear-gradient(${cs[1]}, ${cs[0]})`
  return css`color: ${cs[5]};background: ${gr};`
}
const primaryHover:TyOneStyleFn = (cs) => {
  const gr = `linear-gradient(${cs[2]}, ${cs[1]})`
  return css`
    :hover, :focus, :active {
      color: ${cs[5]};background: ${gr};
    }
  `
}
const secondary:TyOneStyleFn = (cs) => {
  const gr = `linear-gradient(${cs[3]}, ${cs[4]})`
  return css`color: ${cs[0]};background: ${gr};`
}
const secondaryHover:TyOneStyleFn = (cs) => {
  const gr = `linear-gradient(${cs[4]}, ${cs[5]})`
  return css`
    :hover, :focus, :active {
      color: ${cs[0]};background: ${gr};
    }
  `
}

const borderThin:TyOneStyleFn = (cs) => {
  return css`border: 1px solid ${cs[0]};`
}

const shadowNormal:TyOneStyleFn = (cs) => {
  const sh = `0 2px 2px ${cs[0]}`
  return css`
  -webkit-box-shadow: ${sh};box-shadow: ${sh};
  `
}

const shadowHover:TyOneStyleFn = (cs) => {
  const sh_hvr = `0 5px 5px ${cs[0]}`
  return css`
  :hover, :focus{
    -webkit-box-shadow: ${sh_hvr};box-shadow: ${sh_hvr};
  }
  `
}

const shadowActive:TyOneStyleFn = (cs) => {
  const sh_act = `0 0px 10px ${cs[0]}`
  return css`
  :active{
    -webkit-box-shadow: ${sh_act};box-shadow: ${sh_act};
  }
  `
}

const shadow:TyOneStyleFn = (cs) => {
  return css`
    ${shadowNormal(cs)}
    ${shadowHover(cs)}
    ${shadowActive(cs)}
  `
}


const body:TyOneStyleFn = (cs) => {
  return css`color: ${cs[0]};background-color: ${cs[5]};`
}
const head:TyOneStyleFn = (cs) => {
  return css`
    ${primary(cs)}
  `
}
const nav:TyOneStyleFn = (cs) => {
  return css`
    ${primary(cs)}
  `
}
const navItem:TyOneStyleFn = (cs) => {
  return css`
    ${secondary(cs)}
    ${primaryHover(cs)}
    ${shadow(cs)}
    ${borderThin(cs)}
  `
}

const drop:TyOneStyleFn = (cs) => {
  return css`
    ${body(cs)}
  `
}
const dropItem:TyOneStyleFn = (cs) => {
  return css`
    ${secondary(cs)}
    ${primaryHover(cs)}
    ${borderThin(cs)}
    ${shadow(cs)}
  `
}
const burger:TyOneStyleFn = (cs) => {
  return nav(cs)
}
const burgerItem:TyOneStyleFn = (cs) => {
  return navItem(cs)
}
const formBody:TyOneStyleFn = (cs) => {
  return css`
    ${body(cs)}
    ${borderThin(cs)}
  `
}

const formLabel:TyOneStyleFn = (cs) => {
  return css`
    ${borderThin(cs)}
  `
}

const formInput:TyOneStyleFn = (cs) => {
  return css`
    ${secondary(cs)}
    ${secondaryHover(cs)}
    ${shadowNormal(cs)}
    ${borderThin(cs)}
  `
}

const button:TyOneStyleFn = (cs) => {
  return css`
    ${secondary(cs)}
    ${primaryHover(cs)}
    ${shadow(cs)}
    ${borderThin(cs)}
  `
}

const constructor:TyAllStyleFn = (cs:TyCs)=>{
  return {
    body:body(cs),
    head:head(cs),
    primary:primary(cs),
    primaryHover:primaryHover(cs),
    secondary:secondary(cs),
    secondaryHover:secondaryHover(cs),
    borderThin:borderThin(cs),
    shadow:shadow(cs),
    nav:nav(cs),
    navItem:navItem(cs),
    drop:drop(cs),
    dropItem:dropItem(cs),
    burger:burger(cs),
    burgerItem:burgerItem(cs),
    formBody:formBody(cs),
    formLabel:formLabel(cs),
    formInput:formInput(cs),
    button:button(cs),
  }
}
const defaultConstructor = {
  name:'default',
  constructor,
  primary,
  primaryHover,
  secondary,
  secondaryHover,
  shadow,
  borderThin,
  body,
  head,
  nav,
  navItem,
  drop,
  dropItem,
  burger,
  burgerItem,
  formBody,
  formInput,
  formLabel,
  button,
}
export default defaultConstructor

export type TyThemeConstructor = typeof defaultConstructor

export const themeConstructors:TyThemeConstructor[] = [
  defaultConstructor
]