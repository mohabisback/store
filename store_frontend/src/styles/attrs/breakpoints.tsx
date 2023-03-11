import styled, { css } from "styled-components"
//[
//['padding', 100, 'px'], //one value will be default percenting
//['width', [100,200,300,200], 'px']
//]

type TyProp = [string, number|number[], string]
export const breakpoints = (
  props:TyProp[],
  screenProp:string='min-width',
  screenValues:number[]=[1440,1024,768,425,0]
) => {

  const screenCount = screenValues.length
  //adjust props array
  for (let prop of props){
    let values = prop[1]
    if (!Array.isArray(values)) values = [values] //convert number to number[]
    if (values.length < screenCount){
      for (let i=0; i<screenCount; i++){
        if (!values[i]){
          values[i] = Math.round(values[0] + ((screenValues[0]-screenValues[i])/screenValues[0]*(96-values[0])))
        }
      }
    }
    prop[1] = values
  }
  
  const cssString:string = screenValues.reduce((rScreens:string, screenValue:number, nScreen:number) => {
    return (rScreens += `
    @media screen and (${screenProp}: ${screenValue}px) {
      ${props.reduce<string>((rProps:string, prop:TyProp)=>{ //prop = ['width', [100,200,300,200], 'px']
        const [name, values, unit]  = prop;
        if(!Array.isArray(values)) return ''
        return (rProps += `${name}: ${values[nScreen]}${unit};
        `)
      },'')}}`);
  }, '');
  return css`${cssString}`;
};
