import React from 'react';
import SignedUserContext from '../../../globals/contexts/SignedUserContext';

const AddProductPage = () => {
  const { signedUser } = React.useContext(SignedUserContext);
  return (
    <>
      <h1>This is AddProduct</h1>
      <div>Hello, {signedUser?.firstName}</div>
    </>
  )
};

export default AddProductPage;
