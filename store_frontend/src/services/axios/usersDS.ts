//Upload Data Services
import { TyUser } from '@backend/users';
import myAxios from './_myAxios';

export default class UsersDS {
  static Check = (email:string) => {
    return myAxios.get(`users/check/${email}`);
  };

  static Register = (user:TyUser) => {
    return myAxios.post(`users/register`, { user });
  };

  static Login = (user:TyUser) => {
    return myAxios.post(`users/login-email`, { user });
  };

  static LoginGoogle = (code:object) => {
    return myAxios.post(`users/login-google`, { code });
  };

  static LoginFacebook = (userID:string, accessToken:string) => {
    return myAxios.post(`users/login-facebook`, { userID, accessToken });
  };

  static Logout = () => {
    return myAxios.post(`users/logout`);
  };

  static VerifyEmail = (query:string) => {
    return myAxios.post(`users/verify-email${query}`);
  };

  static ResetPasswordQuest = (user:TyUser) => {
    return myAxios.post(`users/reset-password-quest`, { user });
  };

  static ResetPassword = (user:TyUser) => {
    return myAxios.post(`users/reset-password`, { user });
  };

  //anything requires a user
  static Modify = (user:TyUser) => {
    return myAxios.post(`users/login`, { user });
  };

  static Account = (emailOrId:string) => {
    return myAxios.get(`users/account/${emailOrId}`);
  };
}
