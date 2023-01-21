import React from 'react';
import { NavLink } from 'react-router-dom';
import SignedUserContext from '../../../globals/contexts/SignedUserContext.js';
import UsersDS from '../../../services/axios/usersDS.js';
import addLocalStorage from '../../../utils/addLocalStorage.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//with props = {key:number, liClass:string, linkClass:string }
const Logout = ({ liClass, linkClass, onClickPlus }) => {
  const { setSignedUser } = React.useContext(SignedUserContext);
  const onClick = (e) => {
    onClickPlus();
    logout();
  };

  const logout = () => {
    UsersDS.Logout()
      .then((result) => {
        addLocalStorage(result.data);
        setSignedUser(result.data.signedUser);
      })
      .catch((e) => {});
  };

  return (
    <li className={liClass}>
      <NavLink
        className={linkClass}
        to={'/'}
        onClick={onClick}
      >
        {' '}
        <FontAwesomeIcon
          icon={'right-from-bracket'}
          size='1x'
        />
        Sign out
      </NavLink>
    </li>
  );
};

export default Logout;
