import React from 'react'
import styled from 'styled-components';
import ThemeContext from '../../contexts/ThemeContext';
import PxDiv from '../../styles/Pxs/PxDiv'
import PxButton from '../../styles/Pxs/PxButton'
import {PxH1,PxH2,PxH3,PxH4,PxH5,PxH6} from '../../styles/Pxs/PxH'
import PxInput from '../../styles/Pxs/PxInput'
import { TyAttrs } from '../../styles/attrs/attrsHandler'
import TooltipContext from '../../contexts/TooltipContext'
import MessageContext from '../../contexts/MessageContext'
import WindowContext from '../../contexts/WindowContext';
import Cropper from '../../components/Cropper';
const Footer = () => {
  const {theme} = React.useContext(ThemeContext)
  const {tooltip} = React.useContext(TooltipContext)
  const {message} = React.useContext(MessageContext)
  const {clientX, clientY, scrollY, lastScrollY} = React.useContext(WindowContext)

  return(
  <div>
    <h3>notging</h3>
    <h3>asdf</h3>
    <h3>theme.width:{theme.width}, theme.height:{theme.height}</h3>
    <h3>clientX:{clientX}, clientY:{clientY}</h3>
    <h3>scrollY:{scrollY}, lastScrollY:{lastScrollY}</h3>
    <div style={{display:'inline-block'}}
    onMouseOver = {(ev)=>{tooltip(ev,`TestingTestingTestingTestingTestingTestingTestingTesting 
    TestingTestingTestingTestingTestingTestingTestingTesting
    TestingTestingTestingTestingTestingTestingTestingTesting
    TestingTestingTesting TestingTestingTestingTesting 
    TestingTestingTestingTesting`, 'head1')}}
    >This is div 1</div>
    <div style={{display:'inline-block'}}
    onMouseOver = {(ev)=>{tooltip(ev,'body2','head2')}}
    >This is div 2</div>
    <div style={{display:'inline-block'}}
    onMouseOver = {(ev)=>{tooltip(ev,`TestingTestingTestingTestingTestingTestingTestingTesting 
    TestingTestingTestingTestingTestingTestingTestingTesting
    TestingTestingTestingTestingTestingTestingTestingTesting
    TestingTestingTesting TestingTestingTestingTesting 
    TestingTestingTestingTesting`, 'head3',{color:'red'})}}
    >This is div 3</div>
    <div style={{display:'inline-block'}}
    onMouseOver = {(ev)=>{message('body4','head4')}}
    >This is div 5</div>
    <div style={{display:'inline-block'}}
    onMouseOver = {(ev)=>{message(`TestingTestingTestingTestingTestingTestingTestingTesting 
    TestingTestingTestingTestingTestingTestingTestingTesting
    TestingTestingTestingTestingTestingTestingTestingTesting
    TestingTestingTesting TestingTestingTestingTesting 
    TestingTestingTestingTesting`, 'head5')}}
    >This is div 5</div>
    
    <PxH1>This is h1 styled</PxH1>
    <PxH2>THis is h2</PxH2>
    <PxH3>THis is h3</PxH3>
    <PxH4>THis is h4</PxH4>
    <PxH5>THis is h5</PxH5>
    <PxH6>THis is h6</PxH6>
    <ScInput type={'text'} value={'Text input'}></ScInput>
    <ScInput type={'text'} value={'Text input'}></ScInput>
    <ScInput type={'text'} value={'Text input'}></ScInput>

    <ScButton pxLevel={0}>Button</ScButton>
    <ScButton pxLevel={1}>Button</ScButton>
    <ScButton pxLevel={50}>Button</ScButton>

    <ScDiv
      pxHeight = {20} pxMinHeight = {15} pxMaxHeight = {20}
      pxPaddingBottom = {2} pxPaddingTop ={2}
      pxMarginBottom = {3} pxMarginTop = {3}
    >This is styled in the component</ScDiv>
  </div>);
};
const ScButton = styled(PxButton).attrs<TyAttrs>(props=>({...props, 
  //overlaps everything

}))<TyAttrs>`
`
const ScInput = styled(PxInput)``
  
const ScDiv = styled(PxDiv)`
${({theme})=>{
return ''}};
`

export default Footer;
