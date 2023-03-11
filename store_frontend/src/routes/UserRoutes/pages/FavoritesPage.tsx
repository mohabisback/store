import React from 'react';
import SignedUserContext from '../../../contexts/SignedUserContext';

const FavoritesPage = () => {
  const { signedUser } = React.useContext(SignedUserContext);
  return (
    <>
      <h1>This is Favorites</h1>
      <div>Hello, {signedUser?.firstName}</div>
    </>
  )
};

export default FavoritesPage;
