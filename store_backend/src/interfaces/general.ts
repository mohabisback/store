import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { CartItem, Product } from './store';
export { Response, NextFunction };
import { User } from './users';
export const EmailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export interface Request extends ExpressRequest {
  user?: User;
  file?: any; //for uploading
}
const facets = {
  singles: {category:1},
  arrays: {colors:1, sizes:1},
  dateTrunks:{addDate: 'trunk'},
  buckets: {price:[0,1000,2000,3000]}
}
export type Facets = Partial<typeof facets>

export type Ref = {table: string, projProps?: any, column: string, toColumn?: string}

export enum DayTime {
  Morning,
  Evening,
}

export enum WeekDay {
  Saturday,
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
}

export enum Country {
  USA,
  Canada,
}
export enum State {
  NewYorK,
}
