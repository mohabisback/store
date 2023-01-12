import { NextFunction } from 'express';

type Session = {
  userID: string;
  userName: string;
  email: string;
  socketIDs: string[];
};
export let socketSessionsArr: Session[] = [];

//if socket.auth comes with userID, approve it to socket.userID
//if not, get userName from socket.userName, create userID, approve
//save {userID, socketID} in a local server array
export const socketSession = async (socket: any, next: NextFunction) => {
  //retrieve userID from handshake.auth
  let userID = socket.handshake.auth.userID;
  if (userID) {
    let serverSession = socketSessionsArr.find((session) => session.userID === userID);

    if (serverSession) {
      socket.userID = serverSession.userID;
      socket.userName = serverSession.userName;
      socket.email = serverSession.email;
      serverSession.socketIDs = serverSession.socketIDs.concat([socket.id]);
      console.log('socketSessionsArr: ', socketSessionsArr);
      socket.join(userID);
      return next();
    }
  }

  // create new session
  let userName = socket.handshake.auth.userName;
  let email = socket.handshake.auth.email;
  let socketID = socket.id;
  if (userName && email) {
    if (!userID) {
      userID = email + Date.now();
    }
    socket.userID = userID;
    socketSessionsArr.push({ userID, userName, email, socketIDs: [socketID] });
    console.log('socketSessionsArr: ', socketSessionsArr);
  }
  socket.emit('session', { userID, userName, email, socketID });

  //the socket joins his own userID room
  //so when he send a message, he sees it in on other tabs, or devices
  socket.join(userID);
  next();
};
