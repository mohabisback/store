import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGoogleLogin } from '@react-oauth/google';
import { NavLink } from 'react-router-dom';
import UsersDS from '../../../services/axios/usersDS';

//list item for google sign in
//with props = {key:number, liClass:string, linkClass:string }
const LoginGoogle = ({ liClass, linkClass, onClickPlus }) => {
  const onClick = (e) => {
    onClickPlus();
    googleLogin();
  };
  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      console.log('codeResponse: ', codeResponse);
      UsersDS.LoginSocial({ code: codeResponse.code }).then((result) => {
        //signedUser is set in _myAxios
      });
    },
    onError: async (errResponse) => {
      console.log('errResponse: ', errResponse);
    },
  });

  return (
    <li className={liClass}>
      <NavLink
        className={linkClass}
        to='#'
        onClick={onClick}
      >
        {' '}
        <FontAwesomeIcon
          icon={['fab', 'google']}
          size='1x'
        />
        Sign in with Google
      </NavLink>
    </li>
  );
};

export default LoginGoogle;
