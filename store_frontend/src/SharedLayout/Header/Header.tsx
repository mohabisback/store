import React from 'react'
import styled from 'styled-components'
import {TyAttrs} from '../../styles/attrs/attrsHandler'
import Burger from './Burger/Burger';
import SearchBar from './SearchBar/SearchBar';
import PxNavLink from '../../styles/Pxs/PxBarLink';
import Cart from './Cart';
import PxBar from '../../styles/Pxs/PxBar';
import SubHeader from './SubHeader'
import NavBar from './NavBar';
import useLoginItems from '../../hooks/useLoginItems'
import useSettingItems from '../../hooks/useSettingItems'
import PxIcon from '../../styles/Pxs/PxIcon';
import { FaEllipsisV } from 'react-icons/fa';
import { MdHouse } from 'react-icons/md';
import WindowContext from '../../contexts/WindowContext';

type Props = {headerRef: React.RefObject<HTMLDivElement>}
const Header = ({headerRef}:Props) => {
  
  const {scrollY, lastScrollY} = React.useContext(WindowContext)

  const userBarRef = React.useRef<HTMLUListElement>(null)
  const {loginItems} = useLoginItems()
  const {settingItems} = useSettingItems()

  const [userItems, setUserItems] = React.useState([...loginItems, ...settingItems])
  React.useEffect(()=>{setUserItems([...loginItems, ...settingItems])}, [loginItems, settingItems])
  
  React.useEffect(()=>{
    if (headerRef.current){
      const rect = headerRef.current.getBoundingClientRect()
      if(scrollY === 0) {
        headerRef.current.style.top = '0px'
      } else if(scrollY > lastScrollY && rect.top > (-rect.height)) {
        headerRef.current.style.top =
        Math.max(rect.top-(scrollY-lastScrollY), (-rect.height)).toString()+'px'
      } else if (scrollY < lastScrollY && rect.top < 0){
        headerRef.current.style.top =
        Math.min(rect.top+(lastScrollY-scrollY), 0).toString()+'px'
      }
    }
  },[scrollY, headerRef.current])
  const scale = 1.4
  return (
    <ScHeader ref={headerRef}>
      <ScSubHeader style={{zIndex:2}}
      >
        <PxBar pxScale={scale} pxFontScale={scale}>
          <li>
            <PxNavLink to='/' pxScale={scale} pxFontScale={scale}>
              BrandName
            </PxNavLink>
          </li>
        </PxBar>
        <SearchBar scale={scale}/>
        <NavBar //userBar
          barRef={userBarRef} 
          items={userItems}
          width={35} //percent of the remaining after observeRefs
          //observeRefs={[adminBarRef]}
          scale={scale}
          moreIcon={<PxIcon as={FaEllipsisV}/>}
          //roles={['owner', 'admin', 'editor', 'service','user']}
        />
        <Cart scale={scale}/>
        <Burger scale={scale}/>
      </ScSubHeader>
      <SubHeader/>
    </ScHeader>
  );
};

export default Header

const ScHeader = styled.header<TyAttrs>`
  ${({theme})=>theme.style.head}
  width: 100%;
  position: fixed; top:0; right:0; left:0;
  border-radius: 0;
  transition: top 0.3s ease;
  display: flex; flex-direction: column;
  justify-content: flex-start; align-items: center;
`
const ScSubHeader = styled.div`
  padding: 2px;
  width: 100%;
  display: flex; flex-direction: row;
  justify-content: flex-start; align-items: center;
`