import { Status } from '../../../ErrAPI';
import { NextFunction, Request, Response } from '../../../interfaces/general';
import { OrderTemp } from '../../../interfaces/store';
import { getQueryProps, getQuery } from '../../_functions';

//import OrdersModel from '../../../DB/mongoDB/store/OrdersModel' //mongoDB model
//import OrdersModel from '../../../DB/pgDB/store/OrdersModel' //pgDB model
const OrdersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/OrdersModel`).default;

const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
  const query = getQuery(req.query, OrderTemp);

  const orders = await OrdersModel.getAllOrders(query.search, query.props, query.limit, query.page, query.sort);

  for (let order of orders) {
    //remove props editor shouldn't see
  }
  res.status(Status.OK).send({ orders });
};
export default GetOrders;
