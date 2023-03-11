import express from 'express';
import CheckUser from './usersCtrls/CheckUser';
import GetUsers from './usersCtrls/GetUsers';
import GetUser from './usersCtrls/GetUser';
import RegisterUser from './usersCtrls/RegisterUser';
import LoginEmailUser from './usersCtrls/LoginEmailUser';
import LoginGoogleUser from './usersCtrls/LoginGoogleUser';
import LoginSocialUser from './usersCtrls/LoginFacebookUser';
import LogoutUser from './usersCtrls/LogoutUser';
import VerifyEmailUser from './usersCtrls/VerifyEmailUser';
import ResetPasswordQuestUser from './usersCtrls/ResetPasswordQuestUser';
import ResetPasswordUser from './usersCtrls/ResetPasswordUser';
import UpdateUser from './usersCtrls/UpdateUser';
import ChangePasswordUser from './usersCtrls/ChangePasswordUser';

import GetAddresses from './addressesCtrls/GetAddresses';
import GetAddress from './addressesCtrls/GetAddress';
import AddAddress from './addressesCtrls/AddAddress';
import UpdateAddress from './addressesCtrls/UpdateAddress';

import { ErrAsync } from '../../ErrAPI';
import roleAuth from '../authorize';
import { EnAccess } from '../../types/users';

const router = express.Router({ mergeParams: true });

//body.properties = user.properties
router.route('/register').post(ErrAsync(RegisterUser));

//body.email or .id && //body.password
router.route('/login-email').post(ErrAsync(LoginEmailUser));

//body.code
router.route('/login-google').post(ErrAsync(LoginGoogleUser));

//body.code
router.route('/login-facebook').post(ErrAsync(LoginSocialUser));

//nothing
router.route('/logout').post(ErrAsync(LogoutUser));

//params.emailOrId && //body.verifyToken
router.route('/verify-email/:emailOrId').post(ErrAsync(VerifyEmailUser));

//body.email
router.route('/reset-password-quest/').post(ErrAsync(ResetPasswordQuestUser)); //body.email

//params.emailOrId && query.passToken && body.password
router.route('/reset-password/:emailOrId').post(roleAuth(EnAccess.user, 'Restricted.'), ErrAsync(ResetPasswordUser));

//req.params.emailOrID && //req.body.oldPassword && .newPassword
router.route('/change-password/:emailOrId').post(roleAuth(EnAccess.user, 'Restricted.'), ErrAsync(ChangePasswordUser));

//for index endpoints, req.query is used
//optional limit=100&page=2 //the pages, starts from 1
//optional props as filter, price=300&category=clothes&hidden=false
//optional sort=asc_price&sort1=desc_category &...&sort9=asc_phone

router.route('/index').get(roleAuth(EnAccess.editor, 'Restricted.'), ErrAsync(GetUsers)); //

//params.emailOrID
router.route('/check/:emailOrId').get(ErrAsync(CheckUser));

//params.emailOrId
router.route('/:emailOrId').get(roleAuth(EnAccess.user, 'Restricted.'), ErrAsync(GetUser));

//params.emailOrId  //body.properties
router.route('/:emailOrId').post(roleAuth(EnAccess.user, 'Restricted.'), ErrAsync(UpdateUser));

//addresses
router.route('/addresses/index').get(roleAuth(EnAccess.user, 'Restricted.'), ErrAsync(GetAddresses));
router.route('/addresses/add').post(roleAuth(EnAccess.user, 'Restricted.'), ErrAsync(AddAddress));
router.route('/addresses/:id').post(roleAuth(EnAccess.user, 'Restricted.'), ErrAsync(UpdateAddress));
router.route('/addresses/:id').get(roleAuth(EnAccess.user, 'Restricted.'), ErrAsync(GetAddress));
export default router;
