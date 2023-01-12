import { Access } from '../interfaces/users';
import { Status } from '../ErrAPI';
import { Request, Response, NextFunction } from '../interfaces/general';
import { ErrAsync } from '../ErrAPI';

const roleAuth = (access: Access, message = '') => {
  if (message == '') {
    message = 'Not authorized to access this route';
  }
  return ErrAsync((req: Request, res: Response, next: NextFunction) => {
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
