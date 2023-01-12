import { NextFunction, Response, Request } from 'express';
import { request } from 'http';
import { StatusCodes as Status } from 'http-status-codes';
import { nextTick } from 'process';

//Take care
//every async operation which is not waited for, must and must
//have its error handled, then pass the err to next(err)
//example
// try{
//   setTimeout(() => {
//   throw new Error
//   }, 1000);
// catch (err){next(err)}

export class ErrAPI extends Error {
  constructor(status: Status, message: string) {
    super(message);
    this.status = status;
  }
  status: Status;
}

//handle every async middleware or function
export const ErrAsync = (func: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (err) {
      next(err); //pass it to final Error handler
    }
  };
};
export const ErrHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) {
    //if response already sent
    return next(err); //send it to express to handle it
  }
  let status: Status = err.status || Status.INTERNAL_SERVER_ERROR;
  let message: string = err.message || 'Internal Server Error';

  res.status(status).send(`

  <h2>Error ${status}</h2>
  <h2>${message}</h2>
  
  `);
};

export const noConnMess = (db: string): string => `No connection to ${db} database`;

export { Status };
