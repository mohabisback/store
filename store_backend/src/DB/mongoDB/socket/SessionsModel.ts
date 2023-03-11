import { Collection, MongoClient } from 'mongodb';
import { Status, ErrAPI } from '../../../ErrAPI';
import { NextFunction } from 'express';
import { noConnMess } from '../../../ErrAPI';
const serverSessions = [];
const dbName = 'socket';
const collName = 'session';
let coll: Collection;

export default class SessionsModel {
  static async injectClient(client: MongoClient) {
    if (coll) {
      return;
    }
    try {
      coll = client.db(dbName).collection(collName);
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Failed coll handle in ${collName} model: ${err}`);
    }
  }
}

//if socket.auth comes with userID, approve it to socket.userID
//if not, get userName from socket.userName, create userID, approve
const socketSession = async (socket: any, next: NextFunction) => {
  if (!coll) {
    throw new ErrAPI(Status.BAD_GATEWAY, noConnMess('mongo'));
  }
  /*
  let userID = socket.handshake.auth.userID;
  if (userID) {
    let serverSession = serverSessions.find(session=>session.userID = userID)
    
    if (serverSession){//found in serverSession, no need for database

    }
  }
  let socketSessionCollection
  try {
    socketSessionCollection = await Model.connection.db(db).collection(coll)


  //retrieve userID from handshake.auth
  
  let session;

  if (userID) {
    session = await socketSessionCollection.findOne({userID})
    // find existing session
    if (session) {
      socket.userID = session.userID;
      socket.userName = session.userName;
      socket.email = session.email;
      const responseDB = await socketSessionCollection.updateOne({userID},{$set:{id:socket.id}})
      return;
    }
  }

  // create new session
  const userName = socket.handshake.auth.userName;
  const email = socket.handshake.auth.email;  
  const id = socket.id
  if (userName && email ) {
    userID = email + Date.now();
    socket.userID = userID; 
    const responseDB = await socketSessionCollection.insertOne({userID, email, userName, id})
  }
  socket.emit('session', {email, userID, userName, id: socket.id });

  //the socket joins his own userID room
  //so when he send a message, he sees it in on other tabs, devices
  socket.join(userID);
} catch (e) {
  console.log(e)
}
*/
  next();
};
