import { io } from 'socket.io-client';

const URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_BACKEND_DEVELOPMENT
    : process.env.REACT_APP_BACKEND_PRODUCTION;
const socket = io(URL, { autoConnect: false });

//on start up
const userName = localStorage.getItem('socketUserName');
const email = localStorage.getItem('socketEmail');
const userID = localStorage.getItem('socketUserID');
if (userID) {
  socket.auth = { email, userName, userID };
}

//on first connection, we receive session info from server
socket.on('session', ({ userName, userID, email }) => {
  // store it in the localStorage
  localStorage.setItem('socketUserID', userID);
  localStorage.setItem('socketEmail', email);
  localStorage.setItem('socketUserName', userName);
  socket.auth = { userName, userID, email };
});
export default socket;
