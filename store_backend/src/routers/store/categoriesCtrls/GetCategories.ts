import { Status } from '../../../ErrAPI';
import { NextFunction, Request, Response } from '../../../types/general';
import { TmCategory } from '../../../types/store';
import { getQueryProps, getQuery } from '../../_functions';

//import CategoriesModel from '../../../DB/mongoDB/store/CategoriesModel' //mongoDB model
//import CategoriesModel from '../../../DB/pgDB/store/CategoriesModel' //pgDB model
const CategoriesModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/CategoriesModel`).default;

const GetCategories = async (req: Request, res: Response, next: NextFunction) => {
  const query = getQuery(req.query, TmCategory);

  const categories = await CategoriesModel.getManyCategories(query.props, undefined, query.limit, query.page, query.sort)
  for (let category of categories) {
    //remove props editor shouldn't see
  }
  res.status(Status.OK).send({ categories, message: 'categories are sent.' });
};
export default GetCategories;
