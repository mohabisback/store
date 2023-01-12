import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../interfaces/general';
import { Pack, PackTemp } from '../../../interfaces/store';
import { cleanObject } from '../../_functions';

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

const UpdatePack = async (req: Request, res: Response, next: NextFunction) => {
  //extract id, email
  const { id } = req.params;
  const idNum = parseInt(id);
  let pack: Pack | null;
  if (id && Number.isInteger(idNum)) {
    pack = await PacksModel.getPack({ id: idNum });
  } else {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }
  if (!pack) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Order item not found.');
  }

  let props:Pack|undefined = req.body.pack;
  if (!props) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }
  const unEditables: (keyof Pack)[] = ['id', 'order_id'];
  props = cleanObject(props, PackTemp, unEditables);
  //@ts-ignore
  if (!props || Object.keys(props).length === 0 || Object.keys(props)[0] == '0') {
    throw new ErrAPI(Status.METHOD_NOT_ALLOWED, 'Cant update this property.');
  }
  //update
  let result = await PacksModel.updatePack({ id: pack.id }, props);

  //update status of all items in the pack
  if (result) {
    await OrderItemsModel.updateSomeOrderItems({ pack_id: pack.id }, { status: pack.status });
  }

  const status = result ? Status.OK : Status.BAD_GATEWAY;
  const message = result ? 'Updated' : 'Failed to Update';
  //send response pack to client in response & response message
  res.status(status).send(message);
};

export default UpdatePack;
