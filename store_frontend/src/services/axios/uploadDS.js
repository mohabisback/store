//Upload Data Services
import myAxios from './_myAxios.js'

export default class UploadDS{
  static uploadToServer=(data) => {
    return myAxios.post(`files/uploads/server`, data)
  }

  static uploadToMongo=(data) => {
    return myAxios.post(`files/uploads/mongo`, data)
  }

}
