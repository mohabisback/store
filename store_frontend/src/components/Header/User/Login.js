import React, { useEffect, useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import UserContext from '../../../contexts/UserContext.js';
import UsersDS from '../../../services/axios/usersDS.js';
import AddLocalStorage from '../../../utils/AddLocalStorage.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import conf from './conf.js';



const Login = () => {
  const {user, setUser} = React.useContext(UserContext)
  const [dropdown, setDropdown] = useState(false)
  return (
    <li className='nav-item'>
            {user?.email ?
              (<>
                <NavLink className={'nav-link'}
                  to='#'
                  aria-haspopup="menu"
                  aria-expanded={dropdown ? "true" : "false"}
                  onClick={() => {setDropdown((prev) =>!prev)}}
                >
                  <span>
                    <FontAwesomeIcon icon='user-check' size="1x" />
                    {' '}
                    {user?.firstName}
                  </span>
                  <FontAwesomeIcon icon={`angles-down`} size="1x" /> 
                </NavLink>
                <div className={`nav-dropdown${dropdown ? " show" : ""}`}>
                    <ul>
                      <li className='nav-dropdown-item'>
                        <NavLink
                            className='nav-link'
                            to='/'
                            onClick={(e)=>{
                              UsersDS.Logout()
                              .then(result=>{
                                AddLocalStorage(result.data)
                                setUser(result.data.user) 
                              }).catch(e=>{})
                            }}
                        >Logout </NavLink>
                      </li>
                    </ul>
                  <div className={"nav-arrow"}></div>
                </div>
              </>)
              :
              ( 
                <NavLink to='/user/login'
                  className={({isActive})=>('user-login' + (isActive ? ' active' : ''))}
                >Login</NavLink>
              )
            }
          </li>
  )
}





export default Login