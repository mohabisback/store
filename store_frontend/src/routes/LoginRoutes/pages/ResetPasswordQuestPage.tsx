import React from 'react';
import UsersDS from '../../../services/axios/usersDS';
import { useNavigate } from 'react-router-dom';

const ResetPasswordQuestPage = () => {
  const [formData, setFormData] = React.useState({ email: '' });
  const [message, setMessage] = React.useState('');
  const navigate = useNavigate();
  function eventFunc(ev:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
    const { name, value, type, checked } = (ev.target as HTMLInputElement);
    setFormData((formData) => ({ ...formData, [name]: type === 'checkbox' ? checked : value }));
  }
  function handleSubmit(ev:React.ChangeEvent<HTMLFormElement>) {
    ev.preventDefault(); // won't refresh our page
    //submitToApi(formData)
    UsersDS.ResetPasswordQuest(formData)
      .then((result) => {
        setMessage(result.data.message);
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
      <label>{message}</label>
      <button
        className='form-button'
        name='button'
        type='submit'
        //submit is handled in the form
      >
        Reset my password
      </button>
    </form>
  );
};

export default ResetPasswordQuestPage;
