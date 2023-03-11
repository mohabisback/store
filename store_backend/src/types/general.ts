import type { Request as ExpressRequest, Response as Res, NextFunction as Next } from 'express';

import { TyUser } from './users';
export const EmailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export interface Response extends Res{}
export interface NextFunction extends Next{}
export interface Request extends ExpressRequest {
  user?: TyUser;
  file?: any; //for uploading
}
const TmFacets = {
  singles: { category_id: 1 },
  arrays: { colors: 1, sizes: 1 },
  dateTrunks: { addDate: 'trunk' },
  buckets: { price: [0, 1000, 2000, 3000] },
};
export type TyFacets = Partial<typeof TmFacets>;

export type TyRef = { table: string; projProps?: any; column: string; toColumn?: string };

export enum EnDayTime {
  Morning,
  Evening,
}

export enum EnWeekDay {
  Saturday,
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
}

export enum EnCountry {
  USA,
  Canada,
}
export enum EnState {
  NewYorK,
}
