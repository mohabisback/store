import { Request, Response, NextFunction } from '../../../types/general';
import { Status } from '../../../ErrAPI';
import { getCategoryNameOrId } from './_functions';

//import CategoriesModel from '../../../DB/mongoDB/store/CategoriesModel' //mongoDB model
//import CategoriesModel from '../../../DB/pgDB/store/CategoriesModel' //pgDB model
const CategoriesModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/CategoriesModel`).default;

//params.titleOrId
const GetCategory = async (req: Request, res: Response, next: NextFunction) => {
  //extract id, title
  const category = await getCategoryNameOrId(req.params);
  console.log('cagetory: ', category)
  res.status(Status.OK).send({category, message: 'Category is sent.'});
};
export default GetCategory;
