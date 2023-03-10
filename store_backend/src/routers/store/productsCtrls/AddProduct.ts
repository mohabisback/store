import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { TyProduct, TmProduct } from '../../../types/store';
import { cleanObject, gramIt } from '../../_functions';

//import ProductsModel from '../../../DB/mongoDB/store/ProductsModel' //mongoDB model
//import ProductsModel from '../../../DB/pgDB/store/ProductsModel' //pgDB model
const ProductsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/ProductsModel`).default;

const AddProduct = async (req: Request, res: Response, next: NextFunction) => {
  //get only allowed props from body.product
  let product: TyProduct | undefined = req.body.product;
  if (!product) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }

  const unEditables: (keyof TyProduct)[] = ['id'];
  product = cleanObject(product, TmProduct, unEditables);

  //check essentials
  if (!product || !product.title || !product.price || !product.image1) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Provide title, price & one image.');
  }

  //set defaults
  product.ordersCount = 0;
  product.viewsCount = 0;
  product.grams = gramIt(product.title + ' ' + (product.keywords ? product.keywords : ''));

  //After Insertion actions: title & tokens
  product.id = await ProductsModel.AddProduct(product);
  if (product.id) {
    //send response product to client in response & response message
    res.status(Status.CREATED).send({ productId: product.id, message: 'Product added.' });
  }
};

export default AddProduct;
