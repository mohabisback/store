import { Request, Response, NextFunction } from '../../../types/general';
import { Status } from '../../../ErrAPI';
import { getProductNameOrId } from './_functions';

//import ProductsModel from '../../../DB/mongoDB/store/ProductsModel' //mongoDB model
//import ProductsModel from '../../../DB/pgDB/store/ProductsModel' //pgDB model
const ProductsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/ProductsModel`).default;

//params.titleOrId
const GetProduct = async (req: Request, res: Response, next: NextFunction) => {
  //extract id, title
  const product = await getProductNameOrId(req.params);

  //increase viewsCount by one, don't wait for result
  ProductsModel.incCount({ id: product.id }, { viewsCount: 1 });
  res.status(Status.OK).send({product, message: 'product is sent.'});
};
export default GetProduct;
