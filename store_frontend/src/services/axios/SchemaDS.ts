//Categories Data Services

import { TyCategory } from "@backend/store";
import myAxios from "./_myAxios";

export default class SchemaDS {

  static addOne = (route:string, category:TyCategory) => {
    return myAxios.post(`${route}/add`, { category });
  };

  static update = (route:string, nameOrId:string, category:TyCategory) => {
    return myAxios.post(`${route}/${nameOrId}`, { category });
  };
  
  static getOne = (route:string, nameOrId:string, category:TyCategory) => {
    return myAxios.get(`${route}/${nameOrId}`);
  };
  
  static getMany = (route:string) => {
    return myAxios.get(`${route}/index`);
  };
  
  static deleteOne = (route:string, title:string) => {
    return myAxios.delete(`${route}/${title}`);
  };

  
}
