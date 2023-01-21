import React from 'react';
import SignedUserContext from '../../../globals/contexts/SignedUserContext';

const OrdersPage = () => {
  const { signedUser } = React.useContext(SignedUserContext);
  return (
    <>
      <h1>This is Orders</h1>
      <div>Hello, {signedUser?.firstName}</div>
    </>
  )
};

export default OrdersPage;
