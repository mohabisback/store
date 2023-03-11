import PxNavLink from '../../styles/Pxs/PxBarLink';
import PxDropdown from '../../styles/Pxs/PxDrop';
import AuthorizeItem from '../../utils/AuthorizeItem';
import useDrop from '../../hooks/useDrop';
import { TyAttrs } from '../../styles/attrs/attrsHandler';

export type TyNavObject = {
  scale?:number,
  title?: string,
  to?: string,
  icon?: JSX.Element,
  roles?: string[],
  onClick?: Function,
  attrs?: TyAttrs,
  submenu?: TyNavObject[]
}

type Props = {
  item: TyNavObject,
  depthLevel: number,
  reset: object,
  setReset: Function,
  scale?:number,
}
const NavItem = ({ item, depthLevel, reset, setReset, scale}:Props) => {
  const{elRef, isDropped, setIsDropped } = useDrop(reset)

  return (
    <AuthorizeItem roles = {item?.roles}>
      <li ref={elRef}
        onMouseEnter={() => {window.innerWidth > 970 && setIsDropped(true);}}
        onMouseLeave={() => {window.innerWidth > 970 && setIsDropped(false);}}
      >
        <PxNavLink to={(item?.submenu || !item?.to) ? '#': item.to}
          pxScale={scale || 1} pxFontScale={scale || 1}
          {...(item?.submenu ? {'aria-haspopup':'menu', 'aria-expanded':(isDropped ? true:false)}:{})}
          {...(item?.attrs ? item?.attrs : {})}
          onClick={() => {
            ((item?.submenu)? setIsDropped(v=>!v): setReset({}));
            item?.onClick && item.onClick();
          }
          }
        >
          {item.icon && item.icon}
          {item.title && item.title}
        </PxNavLink>
        
        {item?.submenu && isDropped &&
          <PxDropdown
            pxDepth={depthLevel}
            pxTarget={elRef.current}
          >
            {item?.submenu.map((i, n) => ( 
              <NavItem
                key={n}
                item={i}
                scale={scale}
                depthLevel={depthLevel+1}
                reset={reset}
                setReset={setReset}
              />
            ))}
          </PxDropdown> 
        }
      </li>
    </AuthorizeItem>
  );
};

export default NavItem;
