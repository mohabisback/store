import React from 'react';
import SignedUserContext from '../../contexts/SignedUserContext';

const Homepage = () => {
  const { signedUser } = React.useContext(SignedUserContext);
  return (
    <>
      <h1>This is Home</h1>
      <div>Hello, {signedUser?.firstName}</div>
    </>
  )
};

export default Homepage;
