import React from 'react';
import SignedUserContext from '../contexts/SignedUserContext';

//returns component or children
type Props ={
  roles?:string[],
  children:React.ReactNode
}
const AuthorizeItem = ({children, roles }:Props) => {
  const { signedUser } = React.useContext(SignedUserContext);
  if(!roles ||
    (signedUser?.role === 'owner') ||
    (signedUser?.role === 'admin') ||
    (signedUser?.role && roles.includes(signedUser?.role))
  ) {
    return <>{children}</>
  } else {
    return null
  }
};

export default AuthorizeItem;
