import { Request, Response, NextFunction } from '../../../types/general';
import { Status } from '../../../ErrAPI';
import { getCategoryNameOrId } from './_functions';

//import CategoriesModel from '../../../DB/mongoDB/store/CategoriesModel' //mongoDB model
//import CategoriesModel from '../../../DB/pgDB/store/CategoriesModel' //pgDB model
const CategoriesModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/CategoriesModel`).default;

//params.title
const DeleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  // title
  const {title} = req.params
  const result = await CategoriesModel.deleteCategory({title})
  if(result){
    const categories = await CategoriesModel.getManyCategories()
    res.status(Status.OK).send({categories, message: 'Category is deleted.'});
  } else {
    res.status(Status.BAD_GATEWAY).send({ message: 'Category was not deleted.'});
  }
  
};
export default DeleteCategory;
