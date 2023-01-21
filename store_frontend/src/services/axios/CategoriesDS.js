//Categories Data Services

import myAxios from "./_myAxios";

export default class CategoriesDS {

  static addOne = (category) => {
    return myAxios.post(`categories/add`, { category });
  };

  static update = (nameOrId, category) => {
    return myAxios.post(`categories/${nameOrId}`, { category });
  };
  
  static getOne = (nameOrId, category) => {
    return myAxios.get(`categories/${nameOrId}`);
  };
  
  static getMany = () => {
    return myAxios.get(`categories/index`);
  };
  
  static deleteOne = (title) => {
    return myAxios.delete(`categories/${title}`);
  };

  
}
