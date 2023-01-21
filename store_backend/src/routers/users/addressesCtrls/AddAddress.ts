import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { TyAddress, TmAddress } from '../../../types/users';
import { cleanObject } from '../../_functions';

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

const AddAddress = async (req: Request, res: Response, next: NextFunction) => {
  //get only allowed props from body.address

  let address: TyAddress | undefined = req.body.address;
  if (!address) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }
  const unEditables: (keyof TyAddress)[] = ['id'];
  address = cleanObject(address, TmAddress, unEditables);

  //check essentials
  if (
    !address ||
    !address.user_id ||
    !address.fullName ||
    !address.state ||
    !address.street ||
    !address.buildingNo ||
    !address.floor ||
    !address.apartment ||
    !address.phone
  ) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Provide name, price & one image.');
  }

  //set defaults

  //After Insertion actions: name & tokens
  address.id = await AddressesModel.AddAddress(address);
  if (address.id) {
    //add address_id to user
    await UsersModel.appendAddressId({ id: address.user_id }, address.id);

    //send response address to client in response & response message
    res.status(Status.CREATED).send({ addressId: address.id, message: 'Address added.' });
  }
};

export default AddAddress;
