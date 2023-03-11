import React from 'react';
import SignedUserContext from '../../../contexts/SignedUserContext';

const AddressesPage = () => {
  const { signedUser } = React.useContext(SignedUserContext);
  return (
    <>
      <h1>This is Addresses</h1>
      <div>Hello, {signedUser?.firstName}</div>
    </>
  )
};

export default AddressesPage;
