import React from 'react';
import SignedUserContext from '../../../contexts/SignedUserContext';

const CartPage = () => {
  const { signedUser } = React.useContext(SignedUserContext);
  return (
    <>
      <h1>This is Cart</h1>
      <div>Hello, {signedUser?.firstName}</div>
    </>
  )
};

export default CartPage;
