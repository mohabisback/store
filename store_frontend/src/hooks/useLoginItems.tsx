import React, { useCallback } from 'react';
import SignedUserContext from '../contexts/SignedUserContext';
import { TyNavObject } from '../SharedLayout/Header/NavItem';
import PxIcon from '../styles/Pxs/PxIcon';
import { MdList, MdLogin, MdLogout } from 'react-icons/md';
import { FaAddressBook, FaEnvelopeOpen, FaHeart, FaIdBadge, FaGoogle, FaFacebook} from 'react-icons/fa';
import UsersDS from '../services/axios/usersDS';
import addLocalStorage from '../utils/addLocalStorage';
import { useGoogleLogin } from '@react-oauth/google';
import { useLogin } from 'react-facebook';


const useLoginItems = () => {
  const { signedUser, setSignedUser } = React.useContext(SignedUserContext);
  
  const logout = useCallback(() => {
    UsersDS.Logout()
    .then((result) => {
      addLocalStorage(result.data);
      setSignedUser(result.data.signedUser);
    })
    .catch((err)=>{});
  },[setSignedUser])
    
  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      UsersDS.LoginGoogle({ code: codeResponse.code }).then((result) => {
        //signedUser is set in _myAxios
      });
    },
    onError: async (errResponse) => {
      console.log('errResponse: ', errResponse);
    },
  });
  const { login, status, isLoading, error } = useLogin();
  const facebookLogin = useCallback(async () => {
    try {
      const response = await login({
        scope: 'email',
      });
      const { userID, accessToken } = response.authResponse;
      UsersDS.LoginFacebook(userID, accessToken).then((result) => {
        //signedUser is set in _myAxios
      });
    } catch (err) {
      if (err instanceof Error){
        console.log(err.message);
      }
    }
  },[login])
  
  const createItems = useCallback(()=>{
    return signedUser?.firstName ? [
      { title: signedUser?.firstName || 'Hello', submenu:[
        { title:'Account', icon:<PxIcon as={FaIdBadge}/>, to:'/user/account'},
        { title:'Orders', icon:<PxIcon as={MdList}/>, to:'/user/orders'},
        { title:'Addresses', icon:<PxIcon as={FaAddressBook}/>, to:'/user/addresses'},
        { title:'Favorites', icon:<PxIcon as={FaHeart}/>, to:'/user/favorites'},
        { title: 'Sign out', icon: <PxIcon as={MdLogout}/>, to:'/',
          onClick: logout}
      ]}
    ]:[
      { title: 'Sign in', icon: <PxIcon as={MdLogin}/>, submenu:[
        { title: 'Email', icon:<PxIcon as={FaEnvelopeOpen}/>,
          to: '/login'},
        { title: 'Google', icon:<PxIcon as={FaGoogle}/>,
          onClick: googleLogin },
        { title: 'Facebook', icon:<PxIcon as={FaFacebook}/>,
          onClick: facebookLogin},
      ]}
    ]
  },[signedUser?.firstName])
  const [loginItems, setLoginItems] = React.useState<TyNavObject[]>(createItems())

  React.useEffect(()=>{
    setLoginItems(createItems())
  },[signedUser])

  return {loginItems}
}
export default useLoginItems