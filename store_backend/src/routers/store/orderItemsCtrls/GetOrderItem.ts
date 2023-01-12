import { Request, Response, NextFunction } from '../../../interfaces/general';
import { ErrAPI, Status } from '../../../ErrAPI';
import { OrderItem } from '../../../interfaces/store';

//import OrderItemsModel from '../../../DB/mongoDB/store/OrderItemsModel' //mongoDB model
//import OrderItemsModel from '../../../DB/pgDB/store/OrderItemsModel' //pgDB model
const OrderItemsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/OrderItemsModel`).default;

const GetOrderItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const idNum = parseInt(id);
  //get orderItem from database
  let orderItem: OrderItem | null;
  if (Number.isInteger(idNum)) {
    orderItem = await OrderItemsModel.getOrderItem({ id: idNum });
  } else {
    throw new ErrAPI(Status.UNAUTHORIZED, 'Missing info.');
  }

  res.status(Status.OK).send(orderItem);
};
export default GetOrderItem;
