import React from 'react';
import UsersDS from '../../../services/axios/usersDS';
import SignedUserContext from '../../../contexts/SignedUserContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordPage = () => {
  const { setSignedUser } = React.useContext(SignedUserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email:string|undefined = searchParams.get('email') || undefined;
  const passToken:string|undefined = searchParams.get('passToken') || undefined;
  const [checkPassword, setCheckPassword] = React.useState('');
  const [checkPasswordLabel, setCheckPasswordLabel] = React.useState('');
  const [formData, setFormData] = React.useState({
    email,
    passToken,
    password: '',
  });
  function eventFunc(ev:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
    const { name, value, type, checked } = (ev.target as HTMLInputElement);
    setFormData((formData) => ({ ...formData, [name]: type === 'checkbox' ? checked : value }));
  }
  function handleSubmit(ev:React.FormEvent<HTMLFormElement>) {
    ev.preventDefault(); // won't refresh our page
    //submitToApi(formData)
    if (checkPasswordLabel === `Passwords match`) {
      UsersDS.ResetPassword(formData)
        .then((result) => {
          // set the cookie
          if (result.data.accessToken === undefined) {
          } else {
            setSignedUser(result.data.signedUser);
            navigate(-1); //go back one page
          }
        })
        .catch((e) => {
          //setMessage(e.response.data.message || `Can't sign in`)
        });
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
      <label>{email}</label>
      <label>
        New Password:
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

      <button
        className='form-button'
        name='button'
        type='submit'
        //submit is handled in the form
      >
        Set New Password
      </button>
    </form>
  );
};

export default ResetPasswordPage;
