import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { TyCategory, TmCategory } from '../../../types/store';
import { cleanObject, gramIt } from '../../_functions';

//import CategoriesModel from '../../../DB/mongoDB/store/CategoriesModel' //mongoDB model
//import CategoriesModel from '../../../DB/pgDB/store/CategoriesModel' //pgDB model
const CategoriesModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/CategoriesModel`).default;

const AddCategory = async (req: Request, res: Response, next: NextFunction) => {
  //get only allowed props from body.category
  let category: TyCategory | undefined = req.body.category;
  if (!category) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }

  const unEditables: (keyof TyCategory)[] = ['id'];
  category = cleanObject(category, TmCategory, unEditables);

  //check essentials
  if (!category || !category.title) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Provide title.');
  }

  //After Insertion actions: title & tokens
  category.id = await CategoriesModel.AddCategory(category);
  if (category.id) {
    let categories = await CategoriesModel.getManyCategories()
    //send response category to client in response & response message
    res.status(Status.CREATED).send({ categoryId: category.id, categories, message: 'Category added.' });
  }
};

export default AddCategory;
