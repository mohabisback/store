import { JwtPayload as Payload } from 'jsonwebtoken';
import { CartItem } from './store';

export enum Role {
  owner = 'a243fca@#qa#23@#1',
  admin = 'dda65412#$@$#FDD',
  editor = '3248@d&*a32',
  service = 'asf@#$42Z',
  user = 'user', //signed in
}

export const UserTemp = {
  firstName: 'a',
  lastName: 'a',
  phone: 'a',
  age: 3,
  gender: 'a',
  sendEmails: false,
  //^^user updating level^^
  role: <string>Role.user, //auth writing, auth writing
  //^^editor updating level^^
  id: 123,
  email: 'a',
  verifiedEmail: false,
  //^^user reading level^^
  signInDate: new Date(), // auth reading
  signUpDate: new Date(), // auth reading
  //^^editor reading level^^
  password: 'a',
  verifyToken: 'a',
  passToken: 'a',
  passTokenExp: new Date(),
  //^^admin level^^

  cartItems: <CartItem[]>[],
};
export type User = Partial<typeof UserTemp>;

export const getTokenUser = ({ id, email, role }: User) => {
  return { id, email, role };
};

export const getResUser = ({ id, email, firstName, role, cartItems }: User) => {
  return {
    id,
    email,
    firstName,
    role: Object.keys(Role)[Object.values(Role).indexOf(role as any)],
    cartItems
  };
};

export const TokenSecretTemp = {
  id: 3,
  secret: 'a',
  email: 'a',
  ip: 'a',
  date: new Date(),
  expired: false,
};
export type TokenSecret = Partial<typeof TokenSecretTemp>;

export interface JwtPayload extends Payload {
  user: User;
  secret: string;
}
export enum Access {
  ownerOnly = 'a243fca@#qa#23@#1',
  ownerAdmin = 'a243fca@#qa#23@#1_dda65412#$@$#FDD',
  editor = 'a243fca@#qa#23@#1_dda65412#$@$#FDD_3248@d&*a32',
  service = 'a243fca@#qa#23@#1_dda65412#$@$#FDD_asf@#$42Z',
  editorService = 'a243fca@#qa#23@#1_dda65412#$@$#FDD_3248@d&*a32_asf@#$42Z',
  user = 'a243fca@#qa#23@#1_dda65412#$@$#FDD_3248@d&*a32_asf@#$42Z_user', //must be logged in to pass
}

export const AddressTemp = {
  id: 3,
  user_id: 3,
  fullName: 'a',
  phone: 'a',
  state: 'a',
  street: 'a',
  buildingNo: 'a', //could be 32A
  floor: 'a',
  apartment: 'a',
};
export type Address = Partial<typeof AddressTemp>;
