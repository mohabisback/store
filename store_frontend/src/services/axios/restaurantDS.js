//Restaurants Data Services
import myAxios from './_myAxios.js' 

export default class RestaurantDS{
  static getAll=(page=0) => {
    return myAxios.get(`restaurants?page=${page}`)
  }
  static find = (query, by='name', page=0) => {
    return myAxios.get(`restaurants?${by}=${query}&page=${page}`)
  }
}