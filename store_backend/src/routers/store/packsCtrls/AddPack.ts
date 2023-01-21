import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { EnOrderStatus, TyPack, TmPack } from '../../../types/store';
import { cleanObject } from '../../_functions';

//import OrdersModel from '../../../DB/mongoDB/store/OrdersModel' //mongoDB model
//import OrdersModel from '../../../DB/pgDB/store/OrdersModel' //pgDB model
const OrdersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/OrdersModel`).default;

//import OrderItemsModel from '../../../DB/mongoDB/store/OrderItemsModel' //mongoDB model
//import OrderItemsModel from '../../../DB/pgDB/store/OrderItemsModel' //pgDB model
const OrderItemsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/OrderItemsModel`).default;

//import PacksModel from '../../../DB/mongoDB/store/PacksModel' //mongoDB model
//import PacksModel from '../../../DB/pgDB/store/PacksModel' //pgDB model
const PacksModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/PacksModel`).default;

const PackTem = {
  id: 3,
  order_id: 3,
  status: EnOrderStatus.none, //when updated, items.status must update
  weight: 3,
  ship_code: 'a',
};
const AddPack = async (req: Request, res: Response, next: NextFunction) => {
  //get only allowed props from body.pack

  let pack: TyPack | undefined = req.body.pack;
  if (!pack) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }
  const unEditables: (keyof TyPack)[] = ['id'];
  pack = cleanObject(pack, TmPack, unEditables);

  //check essentials
  if (!pack || !pack.order_id) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Provide title, price & one image.');
  }

  //set defaults
  pack.status = EnOrderStatus.packed;

  //After Insertion actions: title & tokens
  pack.id = await PacksModel.AddPack(pack);
  if (pack.id) {
    //add pack_id to order
    await OrdersModel.appendPackId({ id: pack.order_id }, pack.id);

    //send response pack to client in response & response message
    res.status(Status.CREATED).send({ packId: pack.id, message: 'Pack added.' });
  }
};

export default AddPack;
