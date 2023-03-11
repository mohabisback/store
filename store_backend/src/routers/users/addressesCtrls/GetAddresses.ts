import { Status } from '../../../ErrAPI';
import { NextFunction, Request, Response } from '../../../types/general';
import { TmAddress } from '../../../types/users';
import { getQueryProps, getQuery } from '../../_functions';

//import AddressesModel from '../../../DB/mongoDB/store/AddressesModel' //mongoDB model
//import AddressesModel from '../../../DB/pgDB/store/AddressesModel' //pgDB model
const AddressesModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/AddressesModel`).default;

const GetAddresses = async (req: Request, res: Response, next: NextFunction) => {
  const query = getQuery(req.query, TmAddress);

  const addresses = await AddressesModel.searchAddresses(
    query.search,
    query.props,
    query.limit,
    query.page,
    query.sort,
  );

  for (let address of addresses) {
    //remove props editor shouldn't see
  }
  res.status(Status.OK).send(addresses);
};
export default GetAddresses;
