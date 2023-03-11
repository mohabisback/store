//Categories Data Services

import myAxios from "./_myAxios";

export default class DS {

  static addOne = (route:string, row:any) => {
    return myAxios.post(`${route}/add`, row);
  };
  
  static getOne = (route:string, props:{}) => {
    return myAxios.get(`${route}`, props);
  };
  
  static getMany = (route:string) => {
    return myAxios.get(`${route}/index`);
  };
  
  static deleteOne = (route:string, id:number, confirmationProps:{}={}) => {
    return myAxios.delete(`${route}/${id.toString()}`, confirmationProps);
  };
  
  static update = (route:string, id:number, props:{}) => {
    return myAxios.post(`${route}/${id.toString()}`, props);
  };
}
