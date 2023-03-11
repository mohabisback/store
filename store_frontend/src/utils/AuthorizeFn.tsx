import React from "react"
import SignedUserContext from '../contexts/SignedUserContext'

const AuthorizeFn = (role:string):boolean => {
  const {signedUser} = React.useContext(SignedUserContext)
  const userRole = signedUser?.role
  
  if(!role || role === '' || role === 'guest') return true
  if(!userRole || role === 'none') return false
  if(userRole === 'owner') return true
  if(userRole === 'admin' && role !== 'owner') return true
  if(userRole === 'editor' && (role === 'editor' || role === 'user')) return true
  if(userRole === 'service' && (role === 'service' || role === 'user')) return true
  if(userRole === 'user' && (role === 'user')) return true
  return false
}
export default AuthorizeFn