import React from 'react';
import SignedUserContext from '../../../globals/contexts/SignedUserContext';

const AccountPage = () => {
  const { signedUser } = React.useContext(SignedUserContext);
  console.log('signedUser: ', signedUser)
  return (
    <>
      <h1>This is Account</h1>
      <div>Hello, {signedUser?.firstName}</div>
    </>
  )
};

export default AccountPage;
