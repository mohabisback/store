import { ErrAPI, Status } from '../../../ErrAPI';
import { TyProduct } from '../../../types/store';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const ProductsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/ProductsModel`).default;

export const getProductNameOrId = async (params: any): Promise<TyProduct> => {
  const { titleOrId } = params;
  const id = parseInt(titleOrId);
  //get product from database
  let product: TyProduct | null;
  if (Number.isInteger(id)) {
    product = await ProductsModel.getProduct({ id });
  } else if (titleOrId) {
    product = await ProductsModel.getProduct({ title: titleOrId });
  } else {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing credentials.');
  }
  if (!product) {
    throw new ErrAPI(Status.NOT_FOUND, 'Product not found.');
  }
  return product;
};
