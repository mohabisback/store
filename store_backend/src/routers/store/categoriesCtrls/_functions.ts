import { ErrAPI, Status } from '../../../ErrAPI';
import { TyCategory } from '../../../types/store';

//import UsersModel from '../../../DB/mongoDB/store/UsersModel' //mongoDB model
//import UsersModel from '../../../DB/pgDB/store/UsersModel' //pgDB model
const CategoriesModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/CategoriesModel`).default;

export const getCategoryNameOrId = async (params: any): Promise<TyCategory> => {
  const { titleOrId } = params;
  const id = parseInt(titleOrId);
  //get category from database
  let category: TyCategory | null;
  if (Number.isInteger(id)) {
    category = await CategoriesModel.getCategory({ id });
  } else if (titleOrId) {
    category = await CategoriesModel.getCategory({ title: titleOrId });
  } else {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing credentials.');
  }
  if (!category) {
    throw new ErrAPI(Status.NOT_FOUND, 'Category not found.');
  }
  return category;
};
