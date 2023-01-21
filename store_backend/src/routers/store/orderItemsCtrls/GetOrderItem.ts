import { Request, Response, NextFunction } from '../../../types/general';
import { ErrAPI, Status } from '../../../ErrAPI';
import { TyOrderItem } from '../../../types/store';

//import OrderItemsModel from '../../../DB/mongoDB/store/OrderItemsModel' //mongoDB model
//import OrderItemsModel from '../../../DB/pgDB/store/OrderItemsModel' //pgDB model
const OrderItemsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/OrderItemsModel`).default;

const GetOrderItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const idNum = parseInt(id);
  //get orderItem from database
  let orderItem: TyOrderItem | null;
  if (Number.isInteger(idNum)) {
    orderItem = await OrderItemsModel.getOrderItem({ id: idNum });
  } else {
    throw new ErrAPI(Status.UNAUTHORIZED, 'Missing info.');
  }

  res.status(Status.OK).send({orderItem, message: 'OrderItem is sent.'});
};
export default GetOrderItem;
