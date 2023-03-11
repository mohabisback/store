import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import UsersDS from '../../../services/axios/usersDS';

const VerifyEmailPage = () => {
  const [message, setMessage] = useState(<h1>Loading...</h1>);
  const query = useLocation().search;

  useEffect(() => {
    UsersDS.VerifyEmail(query)
      .then((res) => {
        setMessage(
          <>
            <h1>{res.data.message}</h1>
            <Link
              to='/login'
              className='btn'
            >
              Please login
            </Link>
          </>,
        );
      })
      .catch((err) => {
        if (err.response) {
          setMessage(
            <>
              <h1>
                {err.response.status} {err.response.statusText}
              </h1>
              <h2>{err.response.data.message}</h2>
            </>,
          );
        }
      });
  }, [query]);

  return message;
};

export default VerifyEmailPage;
