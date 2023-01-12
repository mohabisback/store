import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import dotenv from 'dotenv';
import TokensModel from './store/TokensModel';
import FilesModel from './files/FilesModel';
import SessionsModel from './socket/SessionsModel';
import UsersModel from './store/UsersModel';
import ProductsModel from './store/ProductsModel';
import OrdersModel from './store/OrdersModel';
import OrderItemsModel from './store/OrderItemsModel';
import CartItemsModel from './store/CartItemsModel';
dotenv.config();
const cluster = process.env.MONGO_ClUSTER0;

let testConnectionDb: Db
export const dbName = (
  process.env.ENV?.includes('dev') || 
  process.env.ENV?.includes('test')
) ? 'store_test' : 'store';

const mongoClient = MongoClient;
const options: MongoClientOptions = {
  maxPoolSize: 150,
  connectTimeoutMS: 2500,
};
const connectMongoClient = async (): Promise<void> => {
  if (testConnectionDb){
    console.log('mongodb already connected.')
    return
  }
  await mongoClient
    .connect(cluster as string, options)
    .then(async (client) => {
      if (process.env.ENV?.includes('reset')) {
        await client.db('store_test').dropDatabase();
        await client.db('files_test').dropDatabase();
      }
      console.log('Connected to mongoDB...');
      testConnectionDb = client.db('testConnectionDb')
      await TokensModel.injectClient(client);
      await FilesModel.injectClient(client);
      await SessionsModel.injectClient(client);
      await UsersModel.injectClient(client);
      await ProductsModel.injectClient(client);
      await OrdersModel.injectClient(client);
      await OrderItemsModel.injectClient(client);
      await CartItemsModel.injectClient(client);
    })
    .catch((err) => {
      //console.error(err.stack)
      //process.exit(1)
      console.log('Initial mongodb connection error, reconnecting after 3 seconds');
      setTimeout(connectMongoClient, 3000);
    });
};
export default connectMongoClient;
