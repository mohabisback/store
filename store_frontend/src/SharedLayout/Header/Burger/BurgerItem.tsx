import { useState, useEffect, useRef } from 'react';
import BurgerDropdown from './BurgerDropdown';
import { NavLink } from 'react-router-dom';
import PxNavLink from '../../../styles/Pxs/PxBarLink';
import AuthorizeItem from '../../../utils/AuthorizeItem';
import { TyNavObject } from '../NavItem';
import useDrop from '../../../hooks/useDrop';

type Props = {
  item:TyNavObject,
  depthLevel: number,
  resetBurger: object,
  setResetBurger: Function
}
const BurgerItem = ({ item, depthLevel, resetBurger, setResetBurger }:Props) => {

  const{elRef, isDropped, setIsDropped } = useDrop(resetBurger)

  const liClassName = depthLevel > 0 ? 'burger-dropdown-item' : 'burger-item';

  let arrowDirection = 'right';
  if (window.innerWidth < 970) {
    arrowDirection = isDropped ? 'down' : 'right';
  } else {
    arrowDirection = depthLevel > 0 ? 'right' : 'down';
  }

  return (
    
    <AuthorizeItem roles = {item?.roles}>
    <li
      className={liClassName}
      ref={elRef}
    >
      {item.submenu ? (
        <>
          <PxNavLink to='#'
            className={'burger-link'}
            
            aria-haspopup='menu'
            aria-expanded={isDropped ? 'true' : 'false'}
            onClick={() => {
              setIsDropped((prev) => !prev);
            }}
          >
            <span>
              {item.icon && (
                item.icon
              )}{' '}
              {item.title}{' '}
            </span>
          </PxNavLink>
          <BurgerDropdown
            isDropped={isDropped}
            submenu={item.submenu}
            depthLevel={depthLevel}
            setResetBurger={setResetBurger}
            resetBurger={resetBurger}
          />
        </>
      ) : (
        <PxNavLink to={item.to ? item.to : '#'}
          className={'burger-link'}
          onClick={(e) => {
            setResetBurger({});
          }}
          
        >
          <span>
            {item.icon && item.icon}{' '}
            {item.title}
          </span>
        </PxNavLink>
      )}
    </li>
    </AuthorizeItem>
  );
};

export default BurgerItem;
