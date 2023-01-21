import { EnCountry, EnState, EnWeekDay } from './general';

export enum EnSize {
  L = 'L',
}
export enum EnColor {
  blue = 'blue',
}

export const TmCategory = {
  id:3,
  title:'clothes',
  forbidden: true,
  hidden: true
}

export type TyCategory = Partial<typeof TmCategory>

export enum EnOrderStatus {
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
export const TmProduct = {
  title: 'a',
  user_id: 3,
  description: 'a',
  price: 3,
  discount: 3,
  stock: 3, //number of pieces available
  viewsCount: 3, //number of views
  ordersCount: 3, //number of orders
  used: false, //is it new or used
  category_id: TmCategory.id,
  sizes: [EnSize.L],
  colors: [EnColor.blue],
  keywords: 'a b', //string keywords to help in search, and not included in name, separated by space
  maxItems: 3, //max number of items to be bought in one order
  img1: 'a', //external url or local name
  img2: 'a',
  img3: 'a',
  img4: 'a',
  img5: 'a',
  hidden: false,
  //programmatically added
  id: 3,
  grams: 'a a',
};
export type TyProduct = Partial<typeof TmProduct>;

export const TmCartItem = {
  product_id: 3,
  quantity: 3,
  price: 3,
  discount: 3,
  size: EnSize.L,
  color: EnColor.blue,

  id: 3,
  date: new Date(),
  user_id: 3, //related to user, no need to a cart
};
export type TyCartItem = Partial<typeof TmCartItem>;

export const TmOrderItem = {
  //to be sent in order
  product_id: 3,
  quantity: 3,
  price: 3, //buying price of one item
  discount: 3,
  size: EnSize.L,
  color: EnColor.blue,
  //programmatically added
  id: 3,
  status: EnOrderStatus.approved,
  user_id: 3,
  order_id: 3,
  deliveryDate: new Date(),
  pack_id: 3, //when packed for delivery
  serialNos: ['a'], //serial numbers for returning
};
export type TyOrderItem = Partial<typeof TmOrderItem>;

export const TmPack = {
  id: 3,
  order_id: 3,
  status: EnOrderStatus.none, //when updated, items.status must update
  weight: 3,
  ship_code: 'a',
};
export type TyPack = Partial<typeof TmPack>;

export const TmOrder = {
  //to be sent in order
  user_id: 3,
  payment: 'a', //CashOnDeliver vs Credit/Debit
  fullName: 'a',
  phone: 'a',
  addressString: 'a', //can't be address id as the user can change the address after order
  itemsCost: 3,
  shipCost: 3,
  items: <TyOrderItem[]>[TmOrderItem],
  packs: <TyPack[]>[TmPack],

  //programmatically added
  id: 3,
  date: new Date(),
};
export type TyOrder = Partial<typeof TmOrder>;
