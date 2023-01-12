//Upload Data Services
import myAxios from './_myAxios.js'

export default class UsersDS{
  static Check=(email) => {
    return myAxios.get(`users/check/${email}`)
  }
 
  static Register=(user) => {
    return myAxios.post(`users/register`, {user})
  }
  
  static Login=(user) => {
    return myAxios.post(`users/login`, {user})
  }  

  static Logout=(user) => {
    return myAxios.post(`users/logout`, {user})
  }  

  static VerifyEmail=(query) => {
    return myAxios.post(`users/verify-email${query}`)
  }  
  
  static ResetPasswordQuest=(user) => {
    return myAxios.post(`users/reset-password-quest`, {user})
  }

  static ResetPassword=(user) => {
    return myAxios.post(`users/reset-password`, {user})
  }  
  
  //anything requires a user
  static Modify=(user) => {
    return myAxios.post(`users/login`, {user})
  }

  static Account=(emailOrId) => {
    return myAxios.get(`users/account/${emailOrId}`)
  }
}