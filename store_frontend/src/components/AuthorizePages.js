import React from 'react';
import { Navigate } from 'react-router-dom';
import SignedUserContext from '../globals/contexts/SignedUserContext';

//returns component or children
const AuthorizePages = ({children, roles, Component, failTo = '/' }) => {
  const { signedUser } = React.useContext(SignedUserContext);
  //if no signedUser at all go to login
  if (!signedUser?.role) {
    return <Navigate to='/login' />;
  }else if (!roles.includes(signedUser?.role)){
    return <Navigate to={failTo} />;
  } else {
    return Component ? <Component /> : <>{children}</>;
  }
};

export default AuthorizePages;
