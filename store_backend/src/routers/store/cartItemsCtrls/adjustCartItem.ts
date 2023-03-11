import { ErrAPI, Status } from '../../../ErrAPI';
import { TyCartItem, TmCartItem, TyProduct } from '../../../types/store';
import { cleanObject } from '../../_functions';

//import ProductsModel from '../../../DB/mongoDB/store/ProductsModel' //mongoDB model
//import ProductsModel from '../../../DB/pgDB/store/ProductsModel' //pgDB model
const ProductsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/ProductsModel`).default;

//import CartItemsModel from '../../../DB/mongoDB/store/CartItemsModel' //mongoDB model
//import CartItemsModel from '../../../DB/pgDB/store/CartItemsModel' //pgDB model
const CartItemsModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/CartItemsModel`).default;

const adjustLoginCartItem = async (product_id: number, quantity: number, user_id: number): Promise<any> => {
  let product = await ProductsModel.getProduct({ id: product_id });
  if (!product) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Product not found');
  }
  if (product.stock === 0 && quantity > 0) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Out of stock.');
  }
  if (product.stock && product.stock < quantity) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Not enough stock.');
  }
  if (product.maxItems && product.maxItems < quantity) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Max reached.');
  }
  const cartItem: TyCartItem = {
    user_id,
    product_id,
    quantity,
    price: product.price,
    discount: product.discount,
  };
  return await CartItemsModel.cartItem(cartItem);
};

export default adjustLoginCartItem;
