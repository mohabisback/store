import { Status, ErrAPI } from '../../../ErrAPI';
import { Request } from '../../../types/general';
import { Response, NextFunction } from 'express';
import { TyOrder, TyOrderItem, TmOrderItem, EnOrderStatus, TmOrder } from '../../../types/store';
import { cleanObject } from '../../_functions';

//import OrdersModel from '../../../DB/mongoDB/store/OrdersModel' //mongoDB model
//import OrdersModel from '../../../DB/pgDB/store/OrdersModel' //pgDB model
const OrdersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/OrdersModel`).default;

//import ProductsModel from '../../../DB/mongoDB/store/ProductsModel' //mongoDB model
//import ProductsModel from '../../../DB/pgDB/store/ProductsModel'; //pgDB model
const ProductsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/ProductsModel`).default;

//import OrderItemsModel from '../../../DB/mongoDB/store/OrderItemsModel' //mongoDB model
//import OrderItemsModel from '../../../DB/pgDB/store/OrderItemsModel' //pgDB model
const OrderItemsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/OrderItemsModel`).default;

const AddOrder = async (req: Request, res: Response, next: NextFunction) => {
  //get only allowed props from body.order
  let order: TyOrder | undefined = req.body.order;
  if (!order) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }

  //create new array of orderItems, and remove old one
  let itemUnEditables: (keyof TyOrderItem)[] = ['id'];
  let orderItems: TyOrderItem[] = [];
  if (!order.items || !order.items.length) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing Info.');
  } else {
    for (let item of order.items) {
      const newItem = cleanObject({ ...item }, TmOrderItem, itemUnEditables);
      //check essentials
      if (!newItem.product_id || !newItem.price || !newItem.quantity) {
        throw new ErrAPI(Status.BAD_REQUEST, 'Missing Info.');
      }
      orderItems.push(newItem);
    }

    order.items = [];
    delete order.items;
  }

  //adjust order object
  const unEditables: (keyof TyOrder)[] = ['id', 'user_id', 'items', 'packs'];
  order = cleanObject(order, TmOrder, unEditables);

  //check essentials
  if (!order || !order.payment || !order.fullName || !order.phone || !order.addressString) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing Info.');
  }

  //set defaults
  if (!req.user) {
    throw new ErrAPI(Status.UNAUTHORIZED, 'Sign in to order.');
  }
  order.user_id = req.user.id;
  order.date = new Date();

  //add order to database
  order.id = await OrdersModel.AddOrder(order);

  //adjust and add orderItems
  if (order.id) {
    //set defaults
    for (let item of orderItems) {
      item.order_id = order.id;
      item.user_id = order.user_id;
      item.status = EnOrderStatus.ordered;

      //increase ordersCount of product, don't wait for result
      try {
        ProductsModel.incCount({ id: item.product_id }, { ordersCount: item.quantity });
      } catch {}
    }
    //add items to database
    const result: number[] = await OrderItemsModel.AddOrderItems(orderItems);
    if (result) {
      //respond
      res.status(Status.CREATED).send({ orderId: order.id, message: 'Order added successfully.' });
      return;
    }
  }
  //in case of something gone wrong with no error
  res.status(Status.EXPECTATION_FAILED).send({ message: 'Order Failed.' });
};

export default AddOrder;
