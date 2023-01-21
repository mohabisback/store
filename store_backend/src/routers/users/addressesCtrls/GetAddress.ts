import { Request, Response, NextFunction } from '../../../types/general';
import { ErrAPI, Status } from '../../../ErrAPI';
import { TyAddress } from '../../../types/users';

//import AddressesModel from '../../../DB/mongoDB/store/AddressesModel' //mongoDB model
//import AddressesModel from '../../../DB/pgDB/store/AddressesModel' //pgDB model
const AddressesModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/AddressesModel`).default;

const GetAddress = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const idNum = parseInt(id);
  //get address from database
  let address: TyAddress | null;
  if (Number.isInteger(idNum)) {
    address = await AddressesModel.getAddress({ id: idNum });
  } else {
    throw new ErrAPI(Status.UNAUTHORIZED, 'Missing info.');
  }

  res.status(Status.OK).send({address, message: 'Address is sent'});
};
export default GetAddress;
