import { Status } from '../../../ErrAPI';
import { NextFunction, Request, Response } from '../../../types/general';
import { TmOrderItem } from '../../../types/store';
import { getQuery } from '../../_functions';

//import OrderItemsModel from '../../../DB/mongoDB/store/OrderItemsModel' //mongoDB model
//import OrderItemsModel from '../../../DB/pgDB/store/OrderItemsModel' //pgDB model
const OrderItemsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/OrderItemsModel`).default;

const GetOrderItems = async (req: Request, res: Response, next: NextFunction) => {
  const query = getQuery(req.query, TmOrderItem);

  const orderItems = await OrderItemsModel.searchOrderItems(
    query.search,
    query.props,
    query.limit,
    query.page,
    query.sort,
  );

  for (let orderItem of orderItems) {
    //remove props editor shouldn't see
  }
  res.status(Status.OK).send({ orderItems });
};
export default GetOrderItems;
