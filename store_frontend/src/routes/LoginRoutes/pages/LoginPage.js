import React from 'react';
import UsersDS from '../../../services/axios/usersDS';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = React.useState({ email: '', password: '' });
  const [message, setMessage] = React.useState('');
  const navigate = useNavigate();
  function eventFunc(e) {
    const { name, value, type, checked } = e.target;
    setFormData((formData) => ({ ...formData, [name]: type === 'checkbox' ? checked : value }));
  }
  function handleSubmit(e) {
    e.preventDefault(); // won't refresh our page
    //submitToApi(formData)
    UsersDS.Login(formData)
      .then((result) => {
        //signedUser is set in _myAxios.js
        navigate(-1); //go back one page
      })
      .catch((e) => {
        setMessage(e.response.data.message || `Can't sign in`);
      });
  }

  return (
    <form
      id='register-form'
      className='register-form'
      action='/register'
      method='POST'
      onSubmit={handleSubmit}
    >
      <label>
        Email:
        <input
          className='form-email'
          type='email'
          placeholder=''
          name='email'
          value={formData.email}
          onChange={eventFunc}
          required
        />
      </label>

      <label>
        Password:
        <input
          className='form-password'
          type='password'
          placeholder=''
          name='password'
          onChange={eventFunc}
          value={formData.password}
          required
        />
      </label>
      <label>{message}</label>
      <button
        className='form-button'
        name='button'
        type='submit'
        //submit is handled in the form
      >
        Sign In
      </button>
      <Link to={`/login/register`}>Sign Up</Link>
      <Link to={`/login/reset-password-quest`}>Forget Password</Link>
    </form>
  );
};

export default LoginPage;
