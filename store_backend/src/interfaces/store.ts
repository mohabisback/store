import { Country, State, WeekDay } from './general';

export enum Category {
  clothes = 'clothes',
}
export enum Size {
  L = 'L',
}
export enum Color {
  blue = 'blue',
}
export enum OrderStatus {
  cart = 'cart', //it is just a cart, not ordered yet
  ordered = 'ordered', // by client
  cancelled = 'cancelled', // by client or seller
  approved = 'approved', // by seller
  approvedButShort = 'approvedButShort', //turned to be short
  packed = 'packed', // packed in groups of items
  carried = 'carried', // by transporter
  delivered = 'delivered', // to client
  completed = 'completed', // return period is over
  returned = 'returned', //by client
  none = 'none',
}
export const ProductTemp = {
  title: 'a',
  user_id: 3,
  description: 'a',
  price: 3,
  discount: 3,
  stock: 3, //number of pieces available
  viewsCount: 3, //number of views
  ordersCount: 3, //number of orders
  used: false, //is it new or used
  category: Category.clothes,
  sizes: [Size.L],
  colors: [Color.blue],
  keywords:'a b', //string keywords to help in search, and not included in name, separated by space
  maxItems: 3, //max number of items to be bought in one order
  img1: 'a', //external url or local name
  img2: 'a',
  img3: 'a',
  img4: 'a',
  img5: 'a',
  hidden: false,
  //programmatically added
  id: 3,
  grams: 'a a'
};
export type Product = Partial<typeof ProductTemp>;

export const CartItemTemp = {
  product_id: 3,
  quantity: 3,
  price: 3,
  discount: 3,

  id: 3,
  date: new Date(),
  user_id: 3, //related to user, no need to a cart
}
export type CartItem = Partial<typeof CartItemTemp>;

export const OrderItemTemp = {
  //to be sent in order
  product_id: 3,
  quantity: 3,
  price: 3, //buying price of one item
  discount: 3, 
  //programmatically added
  id: 3,
  status: OrderStatus.approved,
  user_id: 3,
  order_id: 3,
  deliveryDate: new Date(),
  pack_id: 3, //when packed for delivery
  serialNos: ['a'], //serial numbers for returning
};
export type OrderItem = Partial<typeof OrderItemTemp>;

export const PackTemp = {
  id: 3,
  order_id: 3,
  status: OrderStatus.none, //when updated, items.status must update
  weight: 3,
  ship_code: 'a',
};
export type Pack = Partial<typeof PackTemp>;

export const OrderTemp = {
  //to be sent in order
  user_id: 3,
  payment: 'a', //CashOnDeliver vs Credit/Debit
  fullName: 'a',
  phone: 'a',
  addressString: 'a', //can't be address id as the user can change the address after order
  itemsCost: 3,
  shipCost: 3,
  items: <OrderItem[]>[OrderItemTemp],
  packs: <Pack[]>[PackTemp],

  //programmatically added
  id: 3,
  date: new Date()
};
export type Order = Partial<typeof OrderTemp>;
