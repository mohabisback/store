import React from 'react';
import { NavLink } from 'react-router-dom';
import SignedUserContext from '../../../globals/contexts/SignedUserContext.js';
import UsersDS from '../../../services/axios/usersDS.js';
import AddLocalStorage from '../../../utils/addLocalStorage.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthorizeItem from '../../AuthorizeItem.js';

const settings = [
  { text: 'Account', to: '/user/account', icon: 'id-badge' },
  { text: 'Orders', to: '/user/orders', icon: 'list-check' },
  { text: 'Addresses', to: '/user/addresses', icon: 'address-book' },
  { text: 'Favorites', to: '/user/favorites', icon: 'heart' },
];
//with props = {key:number, liClass:string, linkClass:string }
const Settings = ({ key, liClass, linkClass, onClickPlus }) => {
  const onClick = (e) => {
    onClickPlus();
  };
  return (
    <>
      {settings.map((i, n) => (
        <AuthorizeItem key={n} roles = {i?.roles}>
        <li
          className={liClass}
        >
          <NavLink
            className={linkClass}
            onClick={onClick}
            to={i.to}
          >
            {' '}
            <FontAwesomeIcon
              icon={i.icon}
              size='1x'
            />
            {i.text}
          </NavLink>
        </li>
        </AuthorizeItem>
      ))}
    </>
  );
};

export default Settings;
