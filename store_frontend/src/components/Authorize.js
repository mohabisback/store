import React from 'react'
import {Navigate} from 'react-router-dom'
import UserContext from '../contexts/UserContext'

const Authorize = ({role, Component}) => {
  const {user} = React.useContext(UserContext)
  
  console.log('Authorize user: ', user)
  //if no user at all go to login
  if (!user?.email) {return <Navigate to ='/user/login' />}
  
  //if there is a user, then switch its role
  //it is assumed that he is a user
  switch (user?.role) {
    //if the user is admin, go for it
    case 'admin':
      return <Component/>

    //if the user is service, then allow service and user roles
    case 'service':
      if (role === 'service' || role === 'user'){
        return <Component/>
      } else {
        break;
      }
    
    //if the user is editor, then allow editor and user roles
    case 'editor':
      if (role === 'editor' || role === 'user'){
        return <Component/>
      } else {
        break;
      }  
    default:
      break;
  }
  // if no role matched, return to home page
  return <Navigate to ='/' />
}

export default Authorize