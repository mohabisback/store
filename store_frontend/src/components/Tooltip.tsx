import React, { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import TooltipContext, {TyTooltipState} from '../contexts/TooltipContext';
import PxDiv from '../styles/Pxs/PxDiv'
import ThemeContext from '../contexts/ThemeContext';
import useOutAction from '../hooks/useOutAction';

let isHovered = false;
let timeout:NodeJS.Timeout;
const Tooltip = () => {
  const {theme} = React.useContext(ThemeContext)

  const {tooltipState, hideTooltip} = React.useContext(TooltipContext)
  const stateRef = React.useRef<TyTooltipState>(tooltipState)
  stateRef.current = tooltipState

  const tooltipRef = React.useRef<HTMLDivElement>(null)
  useOutAction(tooltipRef, ()=>{hideTooltip()});

  const [hoverChanged, setHoverChanged] = React.useState({})
  const onHover = ()=>{console.log('onHover');isHovered = true; setHoverChanged({})}  
  const onNotHover = ()=>{console.log('NotHover');isHovered = false; setHoverChanged({})}  

  //listeners
  React.useEffect(()=>{
    if(tooltipState.show) {isHovered = true}//starting is true

    const target = stateRef?.current?.ev?.target as HTMLElement
    const me = tooltipRef?.current
    if(target || me){
      target?.addEventListener('mouseenter', onHover)
      target?.addEventListener('mouseleave', onNotHover)
      me?.addEventListener('mouseenter', onHover)
      me?.addEventListener('mouseleave', onNotHover)
    }
    return ()=>{
      target?.removeEventListener('mouseenter', onHover)
      target?.removeEventListener('mouseleave', onNotHover)
      me?.removeEventListener('mouseenter', onHover)
      me?.removeEventListener('mouseleave', onNotHover)
    }
  },[tooltipState.show])

  React.useEffect(() => {
    timeout = setTimeout(()=>{
      if(!isHovered) hideTooltip()
    }, tooltipState.delay);
  }, [hoverChanged, tooltipState.show]); //isHovered only, to avoid repeating
  
  
  let down = false
  //correction
  React.useEffect(()=>{
    const rect = tooltipRef.current?.getBoundingClientRect()
    if (tooltipRef.current){
      const W = document.documentElement.clientWidth
      if (rect && rect?.right && rect?.width && rect?.left && rect?.right > W){
        const left = W-rect.width-10
        tooltipRef.current.style.left =`${left}px`
        tooltipRef.current.style.right = '10px'
      }
    }
  },[tooltipState])
  
  const target= tooltipState.ev?.target as HTMLElement
  let tooltipStyle:CSSProperties = {}
  let arrowStyle:CSSProperties = {}
  if (target){
    const targetRect = target.getBoundingClientRect()
    tooltipStyle = { left: `${targetRect.left}px`}
    arrowStyle= { left: `${targetRect.left + Math.min((targetRect.width/2, 20))}px`, }
    if (targetRect.top >= (theme.height - targetRect.bottom)){
      tooltipStyle.bottom = `${theme.height - targetRect.top}px`
      arrowStyle.bottom = tooltipStyle.bottom
      down = false
    } else {
      tooltipStyle.top = `${targetRect.top + targetRect.height}px`
      arrowStyle.top = tooltipStyle.top
      down = true
    }
  }

  const Component = (!tooltipState?.show) ? null : (<>
    {target &&
    <ScArrow 
      {...tooltipState.attrs}
      {...((down && tooltipState.headText) ?
        {head:true, ...tooltipState.headAttrs} :
        {formBody:true, ...tooltipState.bodyAttrs}
      )}
      style = {arrowStyle} className={'tooltip-arrow'}
    ></ScArrow>}
    <ScTooltip
      pxLevel={2}
      ref={tooltipRef}
      style = {tooltipStyle}
    >
      {tooltipState.customJSX ? tooltipState.customJSX :
      <>
        <ScHeader
          pxLevel={1}
          pxMarginBottom={0.5}
          head
          {...tooltipState.attrs}
          {...tooltipState.headAttrs}
        >{tooltipState?.headText && tooltipState.headText}</ScHeader>
        <ScBody
          pxLevel={1}
          formBody
          {...tooltipState.attrs}
          {...tooltipState.bodyAttrs}
        > {tooltipState?.bodyText && tooltipState.bodyText}
        </ScBody>
      </>}
    </ScTooltip>
  </>);

    return createPortal(Component, document.getElementById('tooltip') as Element);

};
export default Tooltip;

const ScArrow = styled(PxDiv)`
  position: fixed;
  width: 20px; height: 20px;
  transform: rotate(45deg);
  padding:0px;
`
const ScTooltip = styled(PxDiv)`
  position: fixed;
  max-width: 80%; max-height: 50%;
  width: fit-content; padding: 10px;
`
const ScHeader = styled(PxDiv)`
  width: 100%;
`
const ScBody = styled(PxDiv)`
  //height: auto;
`

//used like this
//onMouseOver = {(ev)=>{showTooltip({ev, customJSX, headText, bodyText})}}
//onMouseOut = {()=>{hideTooltip(null)}}