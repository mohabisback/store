import { useState, useEffect, useRef } from 'react';
import NavDropdown from './NavDropdown.js';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthorizeItem from '../../AuthorizeItem.js';

const NavItem = ({ item, depthLevel, resetDropdowns, setResetDropdowns }) => {
  //for the dropdown from this navItem
  const [thisDropdown, setThisDropdown] = useState(false);

  //Reset dropdowns when a link is pressed
  useEffect(() => {
    setThisDropdown(false);
  }, [resetDropdowns]);

  //close opened dropdown when click outside it
  let itemRef = useRef();
  useEffect(() => {
    const handler = (event) => {
      if (thisDropdown && itemRef.current && !itemRef.current.contains(event.target)) {
        //remove dropdown from this menu item
        setThisDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [thisDropdown]);

  const liClassName = depthLevel > 0 ? 'nav-dropdown-item' : 'nav-item';
  const arrowDirection = depthLevel > 0 ? 'right' : 'down';

  return (
    <AuthorizeItem roles = {item?.roles}>
    <li
      ref={itemRef}
      className={liClassName}
      onMouseEnter={(e) => {
        window.innerWidth > 970 && setThisDropdown(true);
      }}
      onMouseLeave={(e) => {
        window.innerWidth > 970 && setThisDropdown(false);
      }}
    >
      {item.submenu ? (
        <>
          <NavLink
            className={'nav-link'}
            to='#'
            aria-haspopup='menu'
            aria-expanded={thisDropdown ? 'true' : 'false'}
            //nav item with submenu should alter its dropdown state on click
            onClick={() => {
              setThisDropdown((prev) => !prev);
            }}
          >
            <span>
              {item.icon && (
                <FontAwesomeIcon
                  icon={item.icon}
                  size='1x'
                />
              )}{' '}
              {item.title}{' '}
            </span>
            <FontAwesomeIcon
              icon={`angles-${arrowDirection}`}
              size='1x'
            />
          </NavLink>
          <NavDropdown
            dropdown={thisDropdown}
            submenu={item.submenu}
            depthLevel={depthLevel}
            resetDropdowns={resetDropdowns}
            setResetDropdowns={setResetDropdowns}
          />
        </>
      ) : (
        <NavLink
          className={'nav-link'}
          onClick={(e) => {
            //nav item with no submenu should close dropdown on click
            setResetDropdowns({});
          }}
          to={item.url}
        >
          <span>
            {item.icon && (
              <FontAwesomeIcon
                icon={item.icon}
                size='1x'
              />
            )}{' '}
            {item.title}
          </span>
        </NavLink>
      )}
    </li>
    </AuthorizeItem>
  );
};

export default NavItem;
