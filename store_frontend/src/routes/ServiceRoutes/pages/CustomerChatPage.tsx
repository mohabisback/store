import React from 'react';
import SignedUserContext from '../../../contexts/SignedUserContext';

const CustomerChatPage = () => {
  const { signedUser } = React.useContext(SignedUserContext);
  return (
    <>
      <h1>This is CustomerChat</h1>
      <div>Hello, {signedUser?.firstName}</div>
    </>
  )
};

export default CustomerChatPage;
