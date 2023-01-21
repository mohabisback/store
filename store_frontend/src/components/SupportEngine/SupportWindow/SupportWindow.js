//Dependencies
import React, { useState } from 'react';

//Local Dependencies
import GlobalContext from '../../../globals/contexts/Template';

//Styles
import { styles } from '../styles';
//SubComponents
import EmailForm from './EmailForm';
import ChatEngine from './ChatEngine';

const SupportWindow = () => {
  //Global Variables
  const { socket } = React.useContext(GlobalContext);
  const [socketConnected, setSocketConnected] = React.useState(socket.connected);
  React.useEffect(() => {
    if (!socketConnected) {
      const userName = localStorage.getItem('socketUserName');
      const email = localStorage.getItem('socketEmail');
      const userID = localStorage.getItem('socketUserID');
      if (userID) {
        socket.auth = { email, userName, userID };
        socket.connect();
        setSocketConnected(true);
      }
    }
  }, [socketConnected, socket]);
  return (
    <div
      className='transition-5'
      style={{
        ...styles.supportWindow,
      }}
    >
      {socketConnected ? (
        <ChatEngine setSocketConnected={setSocketConnected} />
      ) : (
        <EmailForm setSocketConnected={setSocketConnected} />
      )}
    </div>
  );
};

export default SupportWindow;
