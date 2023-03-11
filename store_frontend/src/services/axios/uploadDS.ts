//Upload Data Services
import myAxios from './_myAxios';

const renameFile = (file:File) => {


}

export default class UploadDS {
  static uploadToServer = (data:any, filename:string) => {
    return myAxios.post(`files/uploads/server/${filename}`, data);
  };

  static uploadToMongo = (data:any, filename:string) => {
    return myAxios.post(`files/uploads/mongo/${filename}`, data);
  };
}
