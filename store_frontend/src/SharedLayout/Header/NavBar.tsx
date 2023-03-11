import React from 'react';
import NavItem, {TyNavObject} from './NavItem';
import PxBar from '../../styles/Pxs/PxBar'
import useBarMore from '../../hooks/useBarMore'
import AuthorizeItem from '../../utils/AuthorizeItem';

type Props = {
  items:TyNavObject[]
  barRef:React.RefObject<HTMLUListElement>,
  scale:number,
  width:number,
  observeRefs?:React.RefObject<HTMLUListElement>[],
  roles?:string[],
  moreIcon:JSX.Element,
}
const NavBar = ({items, barRef, scale, width, observeRefs, roles, moreIcon}:Props) => {
  const {barItems} = useBarMore(items, barRef, width, moreIcon, observeRefs)
  const [reset, setReset] = React.useState({});

  return (
    <AuthorizeItem roles = {roles}>
      <PxBar
        ref={barRef}
        pxScale={scale} pxFontScale={scale}
      >
        {barItems.map((i:TyNavObject, n:number) => {
          return (
            <NavItem
              key={n}
              item={i}
              scale={scale}
              depthLevel={0}
              reset={reset}
              setReset={setReset}
            />
          );
        })}
      </PxBar>
    </AuthorizeItem>
  );
};

export default NavBar;
