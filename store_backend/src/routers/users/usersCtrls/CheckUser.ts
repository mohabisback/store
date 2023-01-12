import { EmailFormat, NextFunction, Request, Response } from '../../../interfaces/general';
import { Status, ErrAPI } from '../../../ErrAPI';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //mongoDB model
const UsersModel = require(`../../../DB/${ process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'}/store/UsersModel`).default;

const CheckUser = async (req: Request, res: Response, next: NextFunction) => {
  //extract id, email
  const { emailOrId } = req.params;
  const id = parseInt(emailOrId);
  //get user from database
  let count: number = 0;
  if (Number.isInteger(id)) {
    count = await UsersModel.getUsersCount({ id });
  } else if (emailOrId.match(EmailFormat)) {
    count = await UsersModel.getUsersCount({ email: emailOrId });
  } else {
    throw new ErrAPI(Status.UNAUTHORIZED, 'Missing credentials.');
  }

  if (count) {
    res.status(Status.OK).send('Account Found.');
  } else {
    res.status(Status.NO_CONTENT).send('Account Not found.');
  }
};
export default CheckUser;
