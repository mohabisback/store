import React from 'react';
import SignedUserContext from '../globals/contexts/SignedUserContext';

//returns component or children
const AuthorizeItem = ({children, roles }) => {
  const { signedUser } = React.useContext(SignedUserContext);
  if(!roles || (signedUser?.role && roles.includes(signedUser?.role))) {
    return <>{children}</>
  } else {
    return null
  }
};

export default AuthorizeItem;
