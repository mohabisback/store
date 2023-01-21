import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.ENV);
import express from 'express';
import cors, { CorsOptions } from 'cors';
import http from 'http';
import filesRouter from './routers/files/filesRouter';
import usersRouter from './routers/users/usersRouter';
import storeRouter from './routers/store/storeRouter';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
// @ts-ignore
import xss from 'xss-clean';
import { Server, Socket } from 'socket.io';
import AuthenticateTokens from './routers/users/tokensCtrls/AuthenticateTokens';
import { socketSession, socketSessionsArr } from './utils/socketSession';
import startMongoClient from './DB/mongoDB/mongoClient';
import { ErrHandler, ErrAPI, Status } from './ErrAPI';
import startPgClient from './DB/pgDB/pgClient';
//Server
const app = express();
//proxy
app.set('trust proxy', 1);

//pug (jade)
app.set('view engine', 'pug');
app.set('views', './views/pug');

const port = process.env.PORT || 5000;

//MiddleWares
app.use(helmet());
const corsOptions: CorsOptions = {
  origin: [
    process.env.FRONTEND_DEVELOPMENT as string,
    process.env.FRONTEND_PRODUCTION as string,
    'https://mohabisback.netlify.app',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(xss());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./'));

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, X-HTTP-Method-Override',
  );
  next();
});

//Authenticate Tokens
app.use(AuthenticateTokens);

//Routers
app.use('/files', filesRouter);
app.use('/users', usersRouter);
app.use('/', storeRouter);

app.route('/').get((req, res) => {
  res.render('index');
});

app.use('*', () => {
  throw new ErrAPI(Status.NOT_FOUND, 'Page not found...');
});

app.use(ErrHandler);

const server = http.createServer(app);

//don't start the server if it is a test
if (!process.env.ENV || !process.env.ENV?.includes('test')) {
   
  if(process.env.ENV && process.env.ENV.includes('pg')) {
    startPgClient();
  } else {
    startMongoClient();
  }

  server.listen(port, () => {
    console.log(`Server Listening, Port ${port}`);
  });
}

interface MySocket extends Socket {
  userID?: string;
}

// Create an io server with cors options
const io = new Server(server, { cors: corsOptions });

//io.use(socketSession)
// Listen for when the client first time connects via socket.io-client
io.once('connection', (socket) => {});

//on every connection or reconnection
io.on('connection', (socket: MySocket): void => {
  console.log('connected: ', socket.id);
  socket.on('message', ({ content, to }) => {
    socket
      .to(to)
      .to(socket.userID as string)
      .emit('message', {
        content,
        to,
        from: socket.userID,
      });
  });

  socket.on('disconnect', function () {
    console.log('disconnected: ', socket.id);
    /*
    const index = socketSessionsArr.findIndex(session=> socket.id === session.socketID);
    socketSessionsArr.splice(index, 1)
  */
    console.log('socketSessionsArr: ', socketSessionsArr);
  });
});

export default server;
