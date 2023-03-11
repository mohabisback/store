import React from 'react';
import UsersDS from '../../../services/axios/usersDS';
import { useNavigate } from 'react-router-dom';
import { TyUser } from '@backend/users';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [checkPassword, setCheckPassword] = React.useState('');
  const [checkPasswordLabel, setCheckPasswordLabel] = React.useState('');
  const [checkEmailLabel, setCheckEmailLabel] = React.useState('');
  const [formData, setFormData] = React.useState<TyUser>({});
  function eventFunc(ev:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
    const { name, value, type, checked } = (ev.target as HTMLInputElement);
    setFormData((formData) => ({ ...formData, [name]: type === 'checkbox' ? checked : value }));
  }
  function handleSubmit(ev:React.FormEvent<HTMLFormElement>) {
    ev.preventDefault(); // won't refresh our page
    //submitToApi(formData)
    if (checkEmailLabel !== 'Already Registered Email' && checkPasswordLabel === `Passwords match`) {
      
      UsersDS.Register(formData)
        .then((result) => {
          //signedUser is set in _myAxios
          navigate(-1); //go back one page
        })
        .catch((e) => {
          //setMessage(e.response.data.message || `Can't sign in`)
        });
    }
  }
  function checkEmailFunc() {
    if (formData.email){
    UsersDS.Check(formData.email)
      .then((res) => {
        setCheckEmailLabel(res.data);
      })
      .catch();
    }
  }

  function checkPasswordFunc(ev:React.ChangeEvent<HTMLInputElement>) {
    setCheckPassword(ev.target.value);
    if (ev.target.value === formData.password) {
      setCheckPasswordLabel(`Passwords match`);
    } else {
      setCheckPasswordLabel(`Passwords doesn't match`);
    }
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
        First name:
        <input
          className='form-text'
          type='text'
          placeholder=''
          name='firstName'
          value={formData.firstName || ''}
          onChange={eventFunc}
          required
        />
      </label>

      <label>
        Last Name:
        <input
          className='form-text'
          type='text'
          placeholder=''
          name='lastName'
          value={formData.lastName || ''}
          onChange={eventFunc}
          required
        />
      </label>

      <label>
        Email:
        <input
          className='form-email'
          type='email'
          placeholder=''
          name='email'
          value={formData.email || ''}
          onChange={eventFunc}
          onBlur={checkEmailFunc}
          required
        />
      </label>
      <label>{checkEmailLabel}</label>
      <label>
        Password:
        <input
          className='form-password'
          type='password'
          placeholder=''
          name='password'
          onChange={eventFunc}
          value={formData.password || ''}
          required
        />
      </label>

      <label>
        Confirm Password:
        <input
          className='form-password'
          type='password'
          placeholder=''
          name='password2'
          onChange={checkPasswordFunc}
          value={checkPassword}
          required
        />
      </label>
      <label>{checkPasswordLabel}</label>
      <label>
        Phone Number:
        <input
          className='form-text'
          type='text'
          placeholder=''
          name='phone'
          value={formData.phone || ''}
          onChange={eventFunc}
        />
      </label>

      <label>
        Age :
        <input
          className='form-number'
          type='number'
          placeholder=''
          name='age'
          onChange={eventFunc}
          value={formData.age || ''}
        />
      </label>

      <label>
        Gender:
        <select
          className='form-select'
          placeholder=''
          name='gender'
          onChange={eventFunc}
          value={formData.gender}
        >
          <option value=''>--Prefer not to say--</option>
          <option value='male'>--Male--</option>
          <option value='female'>--Female--</option>
        </select>
      </label>

      <label>
        <input
          className='form-checkbox'
          type='checkbox'
          //placeholder=""
          name='approve'
          onChange={eventFunc}
          checked={formData.sendEmails || false}
        />{' '}
        Wanna receive a weekly email?
      </label>

      <button
        className='form-button'
        name='button'
        type='submit'
        //submit is handled in the form
      >
        Register
      </button>
    </form>
  );
};

export default RegisterPage;
