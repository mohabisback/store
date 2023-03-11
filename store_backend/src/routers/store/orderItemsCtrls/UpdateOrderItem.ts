import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { TyOrderItem, TmOrderItem } from '../../../types/store';
import { cleanObject } from '../../_functions';

//import OrderItemsModel from '../../../DB/mongoDB/store/OrderItemsModel' //mongoDB model
//import OrderItemsModel from '../../../DB/pgDB/store/OrderItemsModel' //pgDB model
const OrderItemsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/OrderItemsModel`).default;

const UpdateOrderItem = async (req: Request, res: Response, next: NextFunction) => {
  //extract id, email
  const { id } = req.params;
  const idNum = parseInt(id);
  let orderItem: TyOrderItem | null;
  if (id && Number.isInteger(idNum)) {
    orderItem = await OrderItemsModel.getOrderItem({ id: idNum });
  } else {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }
  if (!orderItem) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Order item not found.');
  }

  let props: TyOrderItem | undefined = req.body.orderItem;
  if (!props) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }
  const unEditables: (keyof TyOrderItem)[] = ['id', 'order_id', 'product_id', 'user_id'];
  if (orderItem.pack_id) {
    unEditables.push('pack_id');
  }
  props = cleanObject(props, TmOrderItem, unEditables);
  if (!props) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }
  //update
  let result = await OrderItemsModel.updateOrderItem({ id: orderItem.id }, props);

  const status = result ? Status.OK : Status.BAD_GATEWAY;
  const message = result ? 'Updated' : 'Failed to Update';
  //send response orderItem to client in response & response message
  res.status(status).send(message);
};

export default UpdateOrderItem;
