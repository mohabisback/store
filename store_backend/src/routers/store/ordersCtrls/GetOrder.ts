import { Request, Response, NextFunction } from '../../../types/general';
import { ErrAPI, Status } from '../../../ErrAPI';
import { TyOrder } from '../../../types/store';

//import OrdersModel from '../../../DB/mongoDB/store/OrdersModel' //mongoDB model
//import OrdersModel from '../../../DB/pgDB/store/OrdersModel' //pgDB model
const OrdersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/OrdersModel`).default;

const GetOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const idNum = parseInt(id);
  //get order from database
  let order: TyOrder | null;
  if (Number.isInteger(idNum)) {
    order = await OrdersModel.getOrder({ id: idNum });
  } else {
    throw new ErrAPI(Status.UNAUTHORIZED, 'Missing info.');
  }

  res.status(Status.OK).send({order, message: 'order is sent.'});
};
export default GetOrder;
