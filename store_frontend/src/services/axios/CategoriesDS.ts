//Categories Data Services

import { TyCategory } from "@backend/store";
import myAxios from "./_myAxios";

export default class CategoriesDS {

  static addOne = (category:TyCategory) => {
    return myAxios.post(`categories/add`, { category });
  };

  static update = (nameOrId:string, category:TyCategory) => {
    return myAxios.post(`categories/${nameOrId}`, { category });
  };
  
  static getOne = (nameOrId:string, category:TyCategory) => {
    return myAxios.get(`categories/${nameOrId}`);
  };
  
  static getMany = () => {
    return myAxios.get(`categories/index`);
  };
  
  static deleteOne = (title:string) => {
    return myAxios.delete(`categories/${title}`);
  };

  
}
