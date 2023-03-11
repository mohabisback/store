import { ErrAPI, Status } from '../../../ErrAPI';
import { Request, Response, NextFunction } from '../../../types/general';
import { TyCategory, TmCategory } from '../../../types/store';
import { getCategoryNameOrId } from './_functions';
import { cleanObject } from '../../_functions';

//import CategoriesModel from '../../../DB/mongoDB/store/CategoriesModel' //mongoDB model
//import CategoriesModel from '../../../DB/pgDB/store/CategoriesModel' //pgDB model
const CategoriesModel = require(`../../../DB/${
  process.env.ENV?.includes('mongo') ? 'mongoDB' : 'pgDB'
}/store/CategoriesModel`).default;

const UpdateCategory = async (req: Request, res: Response, next: NextFunction) => {
  //extract id, email
  const category = await getCategoryNameOrId(req.params);

  let props: TyCategory | undefined = req.body.category;
  if (!props) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }
  const unEditables: (keyof TyCategory)[] = ['id'];

  props = cleanObject(props, TmCategory, unEditables);
  if (!props) {
    throw new ErrAPI(Status.BAD_REQUEST, 'Missing info.');
  }

  //@ts-ignore
  if (Object.keys(props).length === 0 || Object.keys(props)[0] == '0') {
    throw new ErrAPI(Status.METHOD_NOT_ALLOWED, 'Cant update this property.');
  }

  //update
  let result = await CategoriesModel.updateCategory({ id: category.id }, props);
  if(result){
    let categories = await CategoriesModel.getManyCategories()
    res.status(Status.OK).send({categories, message: 'Updated.'});
  } else {
    res.status(Status.BAD_GATEWAY).send({ message: 'Failed to Update'});
  }
};

export default UpdateCategory;
