import React from 'react';
import SignedUserContext from '../../../contexts/SignedUserContext';

const AccountPage = () => {
  const { signedUser } = React.useContext(SignedUserContext);
  return (
    <>
      <h1>This is Account</h1>
      <div>Hello, {signedUser?.firstName}</div>
    </>
  )
};

export default AccountPage;
