import styled, { css, FlattenSimpleInterpolation } from "styled-components"
import { TyTheme } from "../../contexts/ThemeContext";

enum Props {
  pxLevel = 'pxLevel', pxGenLevel = 'pxGenLevel',
  pxScale = 'pxScale', pxGenScale = 'pxGenScale',
  pxFontScale = 'pxFontScale',
  pxGenFontScale = 'pxGenFontScale'
}
export type ScaleProps = Partial<Record<keyof typeof Props, number>> 

const px = (theme:TyTheme, scaleProps:ScaleProps):FlattenSimpleInterpolation => {
  const minPadding = 2;
  const maxPadding = 15;
  
  const pxLevel:number = scaleProps.pxLevel || scaleProps.pxGenLevel || 0
  const pxScale:number = scaleProps.pxScale || scaleProps.pxGenScale || 1
  const pxFontScale:number = scaleProps.pxFontScale || scaleProps.pxGenFontScale || 1

  let { fontSize, size, radius } = theme

  size *= pxScale
  fontSize *= pxFontScale
  const h_0 = Math.max((fontSize * size), fontSize) //when size = 1, input is double fontSize
  const r_0 = h_0 * radius / 100
  const p_tb_0 = (h_0-fontSize)/2
  const p_rl_0 = Math.max((r_0)/2, ((h_0-fontSize)/2))
  
  //const RFair = R_0 + (level * P_0_TB)
  
  const R_0max = h_0 /2
  const R_max = R_0max + (pxLevel * Math.min(p_tb_0, maxPadding))
  const R = r_0 * R_max / R_0max
  const p_tb = Math.min(Math.max((pxLevel+1) * p_tb_0, minPadding), maxPadding)
  const p_rl = (pxLevel > 0) ? p_tb : p_rl_0
  
  const height = (h_0 + (pxLevel * (h_0-fontSize)))
  return css`
    font-size: ${Math.round(fontSize).toString()+'px'};
    border-radius: ${Math.round(R).toString()+'px'};
    padding: ${Math.round(p_tb).toString()+'px '+Math.round(p_rl).toString()+'px'};
    height: ${(pxLevel >0)? 'fit-content' : (Math.round(height).toString()+'px')};
    ${(pxLevel>0) ? 'width: fit-content;':''}
  `
};


export default px