import { Db, MongoClient, MongoClientOptions } from 'mongodb';

import FilesModel from './files/FilesModel';
import SessionsModel from './socket/SessionsModel';

import CartItemsModel from './store/CartItemsModel';
import AddressesModel from './store/AddressesModel';
import OrderItemsModel from './store/OrderItemsModel';
import OrdersModel from './store/OrdersModel';
import PacksModel from './store/PacksModel';
import ProductsModel from './store/ProductsModel';
import TokensModel from './store/TokensModel';
import UsersModel from './store/UsersModel';
import { dbDriver, dbResetOrUp, dbName } from '../dbState';
import path from 'path';
import fs from 'fs';

const cluster = process.env.MONGO_ClUSTER0;
let testConnectionDb: Db

const mongoClient = MongoClient;
const options: MongoClientOptions = {
  maxPoolSize: 150,
  connectTimeoutMS: 2500,
};
const startMongoClient = async (): Promise<void> => {
  if(!dbDriver.includes('mongo')) return;

  if (testConnectionDb){
    console.log('mongodb already connected.')
    return
  }
  //start client
  await mongoClient
    .connect(cluster as string, options)
    .then(async (client) => {
      console.log('Connected to mongoDB...');
      testConnectionDb = client.db('testConnectionDb')
      await FilesModel.injectClient(client);
      await SessionsModel.injectClient(client);

      await AddressesModel.injectClient(client);
      await CartItemsModel.injectClient(client);
      await OrderItemsModel.injectClient(client);
      await OrdersModel.injectClient(client);
      await PacksModel.injectClient(client);
      await ProductsModel.injectClient(client);
      await TokensModel.injectClient(client);
      await UsersModel.injectClient(client);

      adjustResetsAndUps(client.db(dbName))
    })
    .catch((err) => {
      //console.error(err.stack)
      //process.exit(1)
      console.log('Initial mongodb connection error, reconnecting after 3 seconds');
      setTimeout(startMongoClient, 3000);
    });
}; 

const adjustResetsAndUps = async (db: Db) =>{
  try{
    //adjust database resets and ups
    if (!dbResetOrUp.includes('reset') && !dbResetOrUp.includes('up')) return;
    
    const databasesFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../database.json')).toString())
    const database = databasesFile[dbDriver]
    const currentDate = database.date
    const mongoDir = '../../../migrations/mongo'
    const jsFiles = fs.readdirSync(path.resolve(__dirname, mongoDir), {withFileTypes: true})
    .filter(item => !item.isDirectory())
    .map(item => item.name)

    let downFiles: string[] = [];
    let upFiles: string[] = [];

    if (dbResetOrUp.includes('reset')){
      downFiles = jsFiles.filter(f=>{
        const fileDate = parseInt(f.substring(0,14))
        return f.endsWith('down.js') && fileDate <= currentDate
      }).reverse()
      upFiles = jsFiles.filter(f=>f.endsWith('up.js'))
    } else if (dbResetOrUp.includes('up')){
      upFiles = jsFiles.filter(f=>{
        const fileDate = parseInt(f.substring(0,14))
        return f.endsWith('up.js') && fileDate > currentDate
      })
    }
    console.log('downFiles', downFiles)
    console.log('upFiles', upFiles)
    try{
      for (let fileName of downFiles){
        const fileDate = parseInt(fileName.substring(0,14))
        const defaultFunction = require(path.join(mongoDir, fileName))
        await defaultFunction(db)
        databasesFile[dbDriver].date = fileDate - 1
        fs.writeFileSync(path.resolve(__dirname, '../../../database.json'), JSON.stringify(databasesFile, null, 2))
      }
      for (let fileName of upFiles){
        const fileDate = parseInt(fileName.substring(0,14))
        const defaultFunction = require(path.join(mongoDir, fileName))
        await defaultFunction(db)
        databasesFile[dbDriver].date = fileDate
        fs.writeFileSync(path.resolve(__dirname, '../../../database.json'), JSON.stringify(databasesFile, null, 2))
      }
      console.log('migrations completed, '+ downFiles.length + ' downFiles, ' + upFiles.length + ' upFiles.')
    } catch (err) {
      console.log('migrations stopped, because of err: ', err)
    }


  } catch (err) {
    console.log(err)
  }                       

}
































export default startMongoClient;
