import styled, { css, FlattenSimpleInterpolation } from "styled-components"
import { TyTheme } from "../../contexts/ThemeContext";

enum WProps {
  pxLeft = 'left', pxRight = 'right',
  pxWidth = 'width', pxMinWidth = 'min-width', pxMaxWidth = 'max-width',
  pxPaddingLeft = 'padding-left', pxPaddingRight = 'padding-right',
  pxMarginLeft = 'margin-left', pxMarginRight = 'margin-right',
  pxRowGap = 'row-gap',
}
enum HProps {
  pxTop = 'top', pxBottom = 'bottom',
  pxHeight = 'height', pxMinHeight = 'min-height', pxMaxHeight = 'max-height',
  pxPaddingTop = 'padding-top', pxPaddingBottom = 'padding-bottom',
  pxMarginTop = 'margin-top', pxMarginBottom = 'margin-bottom',
  pxColumnGap = 'column-gap'
}
enum CProps {
  pxTest='test',
  pxPadding = 'padding', pxMargin = 'margin',
  pxGap = 'gap'
}
const pxingValues = {...CProps, ...WProps, ...HProps}

export type PxingProps =
Partial<Record<keyof typeof WProps, number|[number,string]>> &
Partial<Record<keyof typeof HProps, number|[number,string]>> &
Partial<Record<keyof typeof CProps, number|[number,string]>> 

const pxing = (theme:TyTheme, pxingProps:PxingProps):FlattenSimpleInterpolation => {
  const oppositeStr: string = Object.entries(pxingProps).filter(e=>e[0] in pxingValues && Array.isArray(e[1]))
  .reduce((reduced:string, entry)=> {
    //@ts-ignore
    const factor = (entry[1][1].toLowerCase().trimStart().startsWith('h')) ? theme.height : theme.width

    
    return reduced += `
    ${
    //@ts-ignore
      pxingValues[entry[0]]}: ${Math.round(entry[1][0]/100*factor).toString()}px;`
  } , '')
//@ts-ignore
  const widthStr:string = Object.keys(WProps).filter(k=>(k in pxingProps && !Array.isArray(pxingProps[k])))
    .reduce((reduced:string, k)=>(reduced += `
    ${
      //@ts-ignore
      WProps[k]}: ${Math.round(pxingProps[k]/100*theme.width).toString()}px;`
    ), '')
    //@ts-ignore
    const heightStr:string = Object.keys(HProps).filter(k=>(k in pxingProps && !Array.isArray(pxingProps[k])))
    .reduce((reduced:string, k)=>(reduced += `
    ${
      //@ts-ignore
      HProps[k]}: ${Math.round(pxingProps[k]/100*theme.height).toString()}px;`
    ), '')
    const bothStr:string = Object.keys(CProps)
    //@ts-ignore
    .filter(k=>(k in pxingProps && !Array.isArray(pxingProps[k])))
    .reduce((reduced:string, k)=>{
      //@ts-ignore
      const name:string = CProps[k]
      //@ts-ignore
      const wValue:string = Math.round(pxingProps[k]/100*theme.width)
        //@ts-ignore
      const hValue:string = Math.round(pxingProps[k]/100*theme.height)
      if (name === 'gap'){
        return reduced +=`
        row-gap: ${wValue.toString()}px;
        column-gap: ${hValue.toString()}px;
        `
      }
      return reduced +=`
      ${name}-left: ${wValue.toString()}px;
      ${name}-right: ${wValue.toString()}px;
      ${name}-top: ${hValue.toString()}px;
      ${name}-bottom: ${hValue.toString()}px;`
    }, '')
  
  return css`
      ${oppositeStr + widthStr + heightStr + bothStr}
    `
};


export default pxing