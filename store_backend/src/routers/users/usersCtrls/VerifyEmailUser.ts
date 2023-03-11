import { Status, ErrAPI } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { TyUser } from '../../../types/users';
import { getUserEmailOrId } from './_functions';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const UsersModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/UsersModel`).default;

const VerifyEmailUser = async (req: Request, res: Response, next: NextFunction) => {
  //get credentials from body.user
  let verifyToken: string | undefined = req.body.user.verifyToken;
  if (!verifyToken) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing Credentials.');
  }

  const user = await getUserEmailOrId(req.params);

  //check token
  if (!user.verifiedEmail && user.verifyToken !== verifyToken) {
    throw new ErrAPI(Status.UNAUTHORIZED, 'Wrong Token.');
  } else if (user.verifiedEmail) {
    res.status(Status.OK).send({ message: 'Already verified.' });
  } else {
    const result = await UsersModel.updateUser(
      { id: user.id },
      {
        verifiedEmail: true,
        verifyToken: '',
      },
    );
    if (result) {
      res.status(Status.OK).send({ message: 'Successfully Verified.' });
    }
  }
};
export default VerifyEmailUser;
