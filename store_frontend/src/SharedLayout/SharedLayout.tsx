import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
//import SupportEngine from './SupportEngine/SupportEngine.wait';
import Footer from './Footer/Footer';
import styled from 'styled-components';
import PxDiv from '../styles/Pxs/PxDiv';
import { TyAttrs } from '../styles/attrs/attrsHandler';
import ThemeContext from '../contexts/ThemeContext'

const SharedLayout = () => { 
  const {theme} = React.useContext(ThemeContext)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const [mainTop, setMainTop] = React.useState(100)
  React.useEffect(()=>{
      const rect = headerRef.current?.getBoundingClientRect()
      if (rect) setMainTop(rect.height)
  },[headerRef, theme.width])
  return (
    <ScBody>
      <Header headerRef={headerRef}/>
      <ScMain style={{marginTop: ((mainTop).toString()+'px')}}>
        <Outlet />
      </ScMain>
      <Footer />
    </ScBody>
  );
};

export default SharedLayout;

const ScBody = styled(PxDiv).attrs<TyAttrs>(props=>({...props,
  body:true,
  pxLevel:6,
}))`
width: 100%;
margin: 0;
border-radius: 0;
padding: 0;
height: auto;
display: flex; flex-flow: column nowrap;
justify-content: flex-start; align-items: stretch;
`
const ScMain = styled(PxDiv).attrs<TyAttrs>(props=>({...props,
  pxLevel:5,
  pxPadding:1,
}))`
  border-radius:0px;
  height:fit-content;
  width: 100%;
  display: flex; flex-flow: column noWrap;
  justify-content: flex-start; align-items: flex-start; align-content: flex-start;
`