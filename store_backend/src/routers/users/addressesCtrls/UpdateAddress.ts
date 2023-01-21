import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { TyAddress, TmAddress } from '../../../types/users';

//import AddressesModel from '../../../DB/mongoDB/store/AddressesModel' //mongoDB model
//import AddressesModel from '../../../DB/pgDB/store/AddressesModel' //pgDB model
const AddressesModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/AddressesModel`).default;

import { cleanObject } from '../../_functions';

const UpdateAddress = async (req: Request, res: Response, next: NextFunction) => {
  //extract id, email
  const { id } = req.params;
  const idNum = parseInt(id);
  let address: TyAddress | null;
  if (id && Number.isInteger(idNum)) {
    address = await AddressesModel.getAddress({ id: idNum });
  } else {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }
  if (!address) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Order item not found.');
  }

  let props = { ...req.body.address };
  const unEditables: (keyof TyAddress)[] = ['id', 'user_id'];
  props = cleanObject(props, TmAddress, unEditables);
  //@ts-ignore
  if (Object.keys(props).length === 0 || Object.keys(props)[0] == '0') {
    throw new ErrAPI(Status.METHOD_NOT_ALLOWED, 'Cant update this property.');
  }
  //update
  let result = await AddressesModel.updateAddress({ id: address.id }, props);

  const status = result ? Status.OK : Status.BAD_GATEWAY;
  const message = result ? 'Updated' : 'Failed to Update';
  //send response address to client in response & response message
  res.status(status).send(message);
};

export default UpdateAddress;
