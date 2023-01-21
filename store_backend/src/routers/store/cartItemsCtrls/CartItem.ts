import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { TyCartItem, TyProduct } from '../../../types/store';
import adjustLoginCartItem from './adjustCartItem';

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

const CartItem = async (req: Request, res: Response, next: NextFunction) => {
  let product_id: any | undefined = req.params.product_id;
  let quantity: any | undefined = req.params.quantity;
  quantity = quantity ? quantity : '1';
  product_id = parseInt(product_id);
  quantity = parseInt(quantity);

  if (!req.user || !req.user.id) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }

  let status: Status = Status.BAD_REQUEST;
  let message: string = 'failed.';
  let cartItems: TyCartItem[] | undefined = undefined;
  try {
    if (!product_id || Number.isNaN(product_id) || Number.isNaN(quantity)) {
      message = 'Missing product info.';
    }
    let product: TyProduct | undefined = await ProductsModel.getProduct({ id: product_id });
    if (!product) {
      message = 'Product not found.';
    } else if (product.stock === 0 && quantity > 0) {
      message = 'Out of stock.';
    } else if (product.stock && product.stock < quantity) {
      message = 'Not enough stock.';
    } else if (product.maxItems && product.maxItems < quantity) {
      message = 'Max reached.';
    } else {
      const cartItem: TyCartItem = {
        user_id: req.user.id,
        product_id,
        quantity,
        price: product.price,
        discount: product.discount,
      };
      cartItems = await CartItemsModel.cartItem(cartItem);
      message = 'OK';
      status = Status.OK;
    }
  } catch (err) {}
  if (!cartItems) {
    cartItems = await CartItemsModel.getManyCartItems({ user_id: req.user.id }, undefined, undefined, undefined, {
      date: 1,
    });
  }

  //send response cartItem to client in response & response message
  res.status(status).send({ cartItems, message });
};

export default CartItem;
