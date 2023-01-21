import { JwtPayload as Payload } from 'jsonwebtoken';
import { TyCartItem } from './store';

export enum EnRole {
  owner = 'a243fca@#qa#23@#1',
  admin = 'dda65412#$@$#FDD',
  editor = '3248@d&*a32',
  service = 'asf@#$42Z',
  user = 'user', //signed in
}

export const TmUser = {
  firstName: 'a',
  lastName: 'a',
  phone: 'a',
  age: 3,
  gender: 'a',
  sendEmails: false,
  //^^user updating level^^
  role: <string>EnRole.user, //auth writing, auth writing
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

  cartItems: <TyCartItem[]>[],
};
export type TyUser = Partial<typeof TmUser>;

export const getTokenUser = ({ id, email, role }: TyUser) => {
  return { id, email, role };
};

export const getSignedUser = ({ id, email, firstName, lastName, role }: TyUser) => {
  return {
    id,
    email,
    firstName,
    lastName,
    role: Object.keys(EnRole)[Object.values(EnRole).indexOf(role as any)],
  };
};

export const TmTokenSecret = {
  id: 3,
  secret: 'a',
  email: 'a',
  ip: 'a',
  date: new Date(),
  expired: false,
};
export type TyTokenSecret = Partial<typeof TmTokenSecret>;

export interface JwtPayload extends Payload {
  user: TyUser;
  secret: string;
}
export enum EnAccess {
  ownerOnly = 'a243fca@#qa#23@#1',
  ownerAdmin = 'a243fca@#qa#23@#1_dda65412#$@$#FDD',
  editor = 'a243fca@#qa#23@#1_dda65412#$@$#FDD_3248@d&*a32',
  service = 'a243fca@#qa#23@#1_dda65412#$@$#FDD_asf@#$42Z',
  editorService = 'a243fca@#qa#23@#1_dda65412#$@$#FDD_3248@d&*a32_asf@#$42Z',
  user = 'a243fca@#qa#23@#1_dda65412#$@$#FDD_3248@d&*a32_asf@#$42Z_user', //must be logged in to pass
}

export const TmAddress = {
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
export type TyAddress = Partial<typeof TmAddress>;
