import React from 'react';
import { NavLink } from 'react-router-dom';
import SignedUserContext from '../../../globals/contexts/SignedUserContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoginEmail from './LoginEmail.js';
import LoginGoogle from './LoginGoogle.js';
import LoginFacebook from './LoginFacebook.js';
import Logout from './Logout.js';
import Settings from './Settings.js';

const LoginItem = ({ itemClass, dropdownItemClass, linkClass, firstItemArrow, dropdownClass }) => {
  const { signedUser } = React.useContext(SignedUserContext);
  const [thisDropdown, setThisDropdown] = React.useState(false);

  const closeDropdown = () => {
    setThisDropdown(false);
  };

  //close opened dropdown when click outside it
  let itemRef = React.useRef();
  React.useEffect(() => {
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

  return (
    <li
      ref={itemRef}
      className={itemClass}
    >
      <NavLink
        to='#'
        className={linkClass}
        aria-haspopup='menu'
        aria-expanded={thisDropdown ? 'true' : 'false'}
        onClick={() => {
          setThisDropdown((prev) => !prev);
        }}
      >
        {' '}
        <FontAwesomeIcon
          icon='right-to-bracket'
          size='1x'
        />{' '}
        {signedUser?.email ? signedUser?.firstName : 'Sign in.'}
        <FontAwesomeIcon
          icon={firstItemArrow}
          size='1x'
        />
      </NavLink>

      <div className={`${dropdownClass}${thisDropdown ? ' show' : ''}`}>
        {!signedUser?.email ? (
          <ul>
            <LoginEmail
              liClass={dropdownItemClass}
              linkClass={linkClass}
              onClickPlus={closeDropdown}
            />
            <LoginGoogle
              liClass={dropdownItemClass}
              linkClass={linkClass}
              onClickPlus={closeDropdown}
            />
            <LoginFacebook
              liClass={dropdownItemClass}
              linkClass={linkClass}
              onClickPlus={closeDropdown}
            />
          </ul>
        ) : (
          <ul>
            <Settings
              liClass={dropdownItemClass}
              linkClass={linkClass}
              onClickPlus={closeDropdown}
            />
            <Logout
              liClass={dropdownItemClass}
              linkClass={linkClass}
              onClickPlus={closeDropdown}
            />
          </ul>
        )}
        <div className={'nav-arrow'}></div>
      </div>
    </li>
  );
};

export default LoginItem;
