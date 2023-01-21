import axios from 'axios';
import setContexts from './setContexts.js';
//export const GlobalReducer = (state, action)

//const baseURL = process.env.NODE_ENV === 'development' ?
//process.env.REACT_APP_BACKEND_DEVELOPMENT : process.env.REACT_APP_BACKEND_PRODUCTION
//const baseURL = 'dev-editor-pg.eba-5hxrj7ac.us-east-1.elasticbeanstalk.com'
const baseURL = 'http://localhost:5000'; //local express
//const baseURL = 'https://mohabisback.netlify.app/api/'; // heroku
//const baseURL = 'https://mohabisback.herokuapp.com/'; // heroku
//const baseURL = 'https://data.mongodb-api.com/app/mohabisback-fanvx/endpoint'; // Mongo Realm

const myAxios = axios.create({
  baseURL: baseURL,
  withCredentials: true, // to send the signed cookies with every request
  credentials: 'include',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});
// Add a request interceptor
myAxios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    config.withCredentials = true; // to send the signed cookies with every request
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
myAxios.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    setContexts(response.data)
   
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

export default myAxios;
