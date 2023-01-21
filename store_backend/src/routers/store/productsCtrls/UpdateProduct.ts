import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { TyProduct, TmProduct } from '../../../types/store';
import { getProductNameOrId } from './_functions';
import { cleanObject, gramIt } from '../../_functions';

//import ProductsModel from '../../../DB/mongoDB/store/ProductsModel' //mongoDB model
//import ProductsModel from '../../../DB/pgDB/store/ProductsModel' //pgDB model
const ProductsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/ProductsModel`).default;

const UpdateProduct = async (req: Request, res: Response, next: NextFunction) => {
  //extract id, email
  const product = await getProductNameOrId(req.params);

  let props: TyProduct | undefined = req.body.product;
  if (!props) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }
  const unEditables: (keyof TyProduct)[] = ['id', 'ordersCount', 'viewsCount'];

  props = cleanObject(props, TmProduct, unEditables);
  if (!props) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }

  //@ts-ignore
  if (Object.keys(props).length === 0 || Object.keys(props)[0] == '0') {
    throw new ErrAPI(Status.METHOD_NOT_ALLOWED, 'Cant update this property.');
  }

  //adjust grams
  if (props.title || props.keywords) {
    const title: string = props.title ? props.title : product.title ? product.title : '';
    const keywords: string = props.keywords ? props.keywords : product.keywords ? product.keywords : '';
    props.grams = gramIt(title + ' ' + keywords);
  }

  //update
  let result = await ProductsModel.updateProduct({ id: product.id }, props);

  const status = result ? Status.OK : Status.BAD_GATEWAY;
  const message = result ? 'Updated' : 'Failed to Update';
  //send response product to client in response & response message
  res.status(status).send(message);
};

export default UpdateProduct;
