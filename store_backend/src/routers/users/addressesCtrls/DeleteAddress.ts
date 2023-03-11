import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { TyAddress, TmAddress } from '../../../types/users';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

//import AddressesModel from '../../../DB/mongoDB/store/AddressesModel' //mongoDB model
//import AddressesModel from '../../../DB/pgDB/store/AddressesModel' //pgDB model
const AddressesModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/AddressesModel`).default;

import { cleanObject } from '../../_functions';

const DeleteAddress = async (req: Request, res: Response, next: NextFunction) => {
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

  //update
  let result = await AddressesModel.deleteAddress({ id: address.id });
  if (result && address.id) {
    await UsersModel.removeAddressId({ id: address.user_id }, address.id);
  }
  const status = result ? Status.OK : Status.BAD_GATEWAY;
  const message = result ? 'Updated' : 'Failed to Delete';
  //send response address to client in response & response message
  res.status(status).send(message);
};

export default DeleteAddress;
