import React from 'react'
import UsersDS from '../services/axios/usersDS';
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const [checkPassword, setCheckPassword] = React.useState('')
  const [checkPasswordLabel, setCheckPasswordLabel] = React.useState('')
  const [checkEmailLabel, setCheckEmailLabel] = React.useState('')
  const [formData, setFormData] = React.useState(
  {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      age: '',
      address: '',
      gender: '',
      approve: false, 
  }
)
function eventFunc(e){
  const {name, value, type, checked} =e.target;
  setFormData(formData => ({...formData, [name]: type === "checkbox" ? checked : value}))
}
function handleSubmit(e){
  e.preventDefault() // won't refresh our page
  //submitToApi(formData)
  if(checkEmailLabel !== 'Already Registered Email' && checkPasswordLabel ===`Passwords match`){
    UsersDS.Register(formData)
    .then(result=>{     
      //User is set in _myAxios.js
      navigate(-1) //go back one page
      
    })
    .catch(e=>{
      //setMessage(e.response.data.message || `Can't sign in`)
    })
  }
}
function checkEmailFunc(e){
  UsersDS.Check(formData.email)
  .then(res => {
    setCheckEmailLabel(res.data)
  })
  .catch()
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
            <label>First name: 
            <input className="form-text"
                type="text"
                placeholder=""
                name="firstName"
                value={formData.firstName}
                onChange={eventFunc}
                required
            /></label>

            <label>Last Name: 
            <input className="form-text"
                type="text"
                placeholder=""
                name="lastName"
                value={formData.lastName}
                onChange={eventFunc}
                required
            /></label>

            <label>Email: 
            <input className="form-email"
                type="email"
                placeholder=""
                name="email"
                value={formData.email}
                onChange={eventFunc}
                onBlur={checkEmailFunc}
                required
            /></label>
            <label>{checkEmailLabel}</label>
            <label>Password: 
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
            <label>Phone Number: 
            <input className="form-text"
                type="text"
                placeholder=""
                name="phone"
                value={formData.phone}
                onChange={eventFunc}
            /></label>

            <label>Age : 
            <input className="form-number"
                type="number"
                placeholder=""
                name="age"
                onChange={eventFunc}
                value={formData.age}
            /></label>

            <label>Address: 
            <input className="form-text"
                type="text"
                placeholder=""
                name="address"
                value={formData.address}
                onChange={eventFunc}
            /></label>

            <label>Gender: 
            <select className="form-select"
                placeholder=""
                name="gender"
                onChange={eventFunc}
                value={formData.select}
            >
                <option value="">--Prefer not to say--</option>
                <option value="male">--Male--</option>
                <option value="female">--Female--</option>
            </select></label>

            <label><input className="form-checkbox"
                type="checkbox"
                //placeholder=""
                name="approve"
                onChange={eventFunc}
                checked={formData.approve}
            /> Wanna receive a weekly email?
            </label>
   
            <button className="form-button"
                name="button"
                type="submit"
                //submit is handled in the form
            >Register</button>
        </form>
  )
}

export default Register