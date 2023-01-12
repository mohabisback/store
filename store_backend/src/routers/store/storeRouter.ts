import express from 'express';
import roleAuth from '../authorize';
import { Access } from '../../interfaces/users';

import GetProducts from './productsCtrls/GetProducts';
import GetProduct from './productsCtrls/GetProduct';
import AddProduct from './productsCtrls/AddProduct';
import UpdateProduct from './productsCtrls/UpdateProduct';

import CartItem from './cartItemsCtrls/CartItem'

import GetOrders from './ordersCtrls/GetOrders';
import GetOrder from './ordersCtrls/GetOrder';
import AddOrder from './ordersCtrls/AddOrder';
//no updates for orders, updates are for orderItems

import GetOrderItems from './orderItemsCtrls/GetOrderItems';
import GetOrderItem from './orderItemsCtrls/GetOrderItem';
import UpdateOrderItem from './orderItemsCtrls/UpdateOrderItem';

import GetPacks from './packsCtrls/GetPacks';
import GetPack from './packsCtrls/GetPack';
import AddPack from './packsCtrls/AddPack';
import UpdatePack from './packsCtrls/UpdatePack';

import { ErrAsync } from '../../ErrAPI';

const router = express.Router({ mergeParams: true });

//for index endpoints, req.query is used
//optional search=search+query
//optional limit=100&page=2 //the pages starts from 1)
//optional sort=asc_price&sort1=desc_category &...&sort9=asc_phone

//optional props id=3&price[gt]=0&price[lt]=500&phone[eq]=010000
//where gt = greater than, gte = greater or equal, eq= equal, ne=not equal, lt, lte
//equal can be processed directly id=3&phone='01000'&price[gt]=200
//for search or, use an array &category=clothes,shoes,hats&

//for adding, req.body.props = product.props

//for updating, id or title as param
//then req.body.props = product.props

//for details, id or title as param
//products
router.route('/products/index').get(ErrAsync(GetProducts));
router.route('/products/:titleOrId').get(ErrAsync(GetProduct));
router.route('/products/add').post(roleAuth(Access.editor), ErrAsync(AddProduct));
router.route('/products/:titleOrId').post(roleAuth(Access.editor), ErrAsync(UpdateProduct));

//cart items
router.route('/cartItems/:product_id/:quantity').get(roleAuth(Access.user, 'Restricted.'), ErrAsync(CartItem));

//orders
router.route('/orders/index').get(roleAuth(Access.user, 'Users only, please sign in.'), ErrAsync(GetOrders));
router.route('/orders/add').post(roleAuth(Access.user, 'Users only, please sign in.'), ErrAsync(AddOrder));
router.route('/orders/:id').get(roleAuth(Access.user, 'Users only, please sign in.'), ErrAsync(GetOrder));

//order items
router.route('/order-items/index').get(roleAuth(Access.user, 'Users only, please sign in.'), ErrAsync(GetOrderItems));
router.route('/order-items/:id').post(roleAuth(Access.user, 'Users only, please sign in.'), ErrAsync(UpdateOrderItem));
router.route('/order-items/:id').get(roleAuth(Access.user, 'Users only, please sign in.'), ErrAsync(GetOrderItem));

//packages
router.route('/packs/index').get(roleAuth(Access.user, 'Users only, please sign in.'), ErrAsync(GetPacks));
router.route('/packs/add').post(roleAuth(Access.editor, 'Restricted.'), ErrAsync(AddPack));
router.route('/packs/:id').post(roleAuth(Access.editor, 'Restricted.'), ErrAsync(UpdatePack));
router.route('/packs/:id').get(roleAuth(Access.user, 'Users only, please sign in.'), ErrAsync(GetPack));

export default router;