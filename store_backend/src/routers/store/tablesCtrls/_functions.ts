import { ErrAPI, Status } from '../../../ErrAPI';
import { TyCategory } from '../../../types/store';
import { TyCell } from '../../../types/schemas';

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

export const cleanRow = (obj:object, schRow:TyCell[], adding:boolean, seeing:boolean
  ):{cleanedRow:{id?:number}, noRepeat:object} =>{
  let cleanedRow = {}
  let noRepeat = {}
  const keys = Object.keys(obj)
  schRow.forEach(v=>{
    if(v.name){
      //@ts-ignore
      let value= obj[v.name]
      if (keys.includes(v.name) && value && v.type &&
          v.editRole && v.editRole !== 'none'){
        if (v.type === 'number') {
          if (typeof value !== 'number') value = parseFloat(value)
          if (!Number.isNaN(value)) {
            //@ts-ignore
            cleanedRow[v.name] = value
          }
        } else if (v.type === 'boolean') {
          if (['true', 't', 'tru', 'treu'].includes(value)) value = true
          if (['false', 'fasle', 'flase', 'fals', 'fls'].includes(value)) value = false
          if (typeof value === 'boolean') {
            //@ts-ignore
            cleanedRow[v.name] = value
          }
        } else if (v.type === 'text' || v.type === 'string') {
          if(typeof value !== 'string') value = value.toString()
          if(typeof value === 'string'){
            //@ts-ignore
            cleanedRow[v.name] = value
          }
        }
        if (v.noRepeat){
          //@ts-ignore
          noRepeat[v.name] = value
        }
      }
      if ( adding && v.required &&
        (!keys.includes(v.name) || obj[v.name as keyof typeof obj] === '')){
          throw new ErrAPI(Status.BAD_REQUEST, `Missing or wrong "${v.name}" property.`)
      }
    }
  })
  return {cleanedRow, noRepeat}
}

