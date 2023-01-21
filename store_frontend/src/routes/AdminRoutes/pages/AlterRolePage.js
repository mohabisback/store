import React from 'react';
import SignedUserContext from '../../../globals/contexts/SignedUserContext';

const AlterRolePage = () => {
  const { signedUser } = React.useContext(SignedUserContext);
  return (
    <>
      <h1>This is Alter Role</h1>
      <div>Hello, {signedUser?.firstName}</div>
    </>
  )
};

export default AlterRolePage;
