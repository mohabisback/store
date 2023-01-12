import React from 'react'
import UsersDS from '../services/axios/usersDS';
import UserContext from '../contexts/UserContext';
import { useNavigate, useSearchParams} from 'react-router-dom'

const ResetPassword = () => {
  const {setUser} = React.useContext(UserContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const passToken = searchParams.get('passToken');
  const [checkPassword, setCheckPassword] = React.useState('')
  const [checkPasswordLabel, setCheckPasswordLabel] = React.useState('')
  const [formData, setFormData] = React.useState(
  {
      email,
      passToken,
      password: '',
  }
)
function eventFunc(e){
  const {name, value, type, checked} =e.target;
  setFormData(formData => ({...formData, [name]: type === "checkbox" ? checked : value}))
}
function handleSubmit(e){
  e.preventDefault() // won't refresh our page
  //submitToApi(formData)
  if(checkPasswordLabel ===`Passwords match`){
    UsersDS.ResetPassword(formData)
    .then(result=>{
      // set the cookie
      if (result.data.accessToken === undefined) {

      } else {
        setUser(result.data.user)
        navigate(-1) //go back one page
      }
    })
    .catch(e=>{
      //setMessage(e.response.data.message || `Can't sign in`)
    })
  }
}
function checkPasswordFunc(e){
  setCheckPassword(e.target.value)
  if (e.target.value === formData.password){
    setCheckPasswordLabel(`Passwords match`)
  } else {
    setCheckPasswordLabel(`Passwords doesn't match`)
  }
}
  return (
    <form id='register-form'
          className='register-form'        
          action='/register'
          method='POST'
          onSubmit={handleSubmit}
    >
            <label>{email}
            </label>
            <label>New Password: 
            <input className="form-password"
                type="password"
                placeholder=""
                name="password"
                onChange={eventFunc}
                value={formData.password}
                required
            /></label>

            <label>Confirm Password: 
            <input className="form-password"
                type="password"
                placeholder=""
                name="password2"
                onChange={checkPasswordFunc}
                value={checkPassword}
                required
            /></label>
            <label>{checkPasswordLabel}</label>
   
            <button className="form-button"
                name="button"
                type="submit"
                //submit is handled in the form
            >Set New Password</button>
        </form>
  )
}

export default ResetPassword