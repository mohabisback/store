import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//with props = {key:number, liClass:string, linkClass:string }
const LoginEmail = ({ liClass, linkClass, onClickPlus }) => {
  const onClick = (e) => {
    onClickPlus();
  };

  return (
    <li className={liClass}>
      <NavLink
        className={linkClass}
        to={'/login'}
        onClick={onClick}
      >
        {' '}
        <FontAwesomeIcon
          icon={'envelope-open-text'}
          size='1x'
        />
        Sign in with Email
      </NavLink>
    </li>
  );
};

export default LoginEmail;
