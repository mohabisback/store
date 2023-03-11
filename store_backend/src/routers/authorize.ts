import { EnAccess } from '../types/users';
import { Status } from '../ErrAPI';
import { Request, Response, NextFunction } from '../types/general';
import { ErrAsync } from '../ErrAPI';

const roleAuth = (access: EnAccess, message = '') => {
  if (message == '') {
    message = 'Not authorized to access this route';
  }
  return ErrAsync((req: Request, res: Response, next: NextFunction) => {
    console.log(req.user?.role)
    if (req.user && req.user.role && access.toString().includes(req.user.role.toString())) {
      next();
    } else {
      res.status(Status.UNAUTHORIZED).send({ message });
    }
  });
};

export const sameUserAuth = (userId?: number, reqId?: number): boolean => {
  if (userId && reqId && userId == reqId) return true;
  return false;
};

export default roleAuth;
