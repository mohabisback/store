import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLogin } from 'react-facebook';
import { NavLink } from 'react-router-dom';
import UsersDS from '../../../services/axios/usersDS';

//list item for Facebook sign in
//with props = {key:number, liClass:string, linkClass:string }
const LoginFacebook = ({ liClass, linkClass, onClickPlus }) => {
  const onClick = (e) => {
    onClickPlus();
    facebookLogin();
  };

  const { login, status, isLoading, error } = useLogin();
  const facebookLogin = async () => {
    try {
      const response = await login({
        scope: 'email',
      });
      const { userID, accessToken } = response.authResponse;
      UsersDS.LoginFacebook(userID, accessToken).then((result) => {
        //signedUser is set in _myAxios
      });
    } catch (err) {
      console.log(error.message);
    }
  };

  return (
    <li className={liClass}>
      <NavLink
        className={linkClass}
        to='#'
        onClick={onClick}
      >
        {' '}
        <FontAwesomeIcon
          icon={['fab', 'facebook']}
          size='1x'
        />
        Sign in with Facebook
      </NavLink>
    </li>
  );
};

export default LoginFacebook;
