import sendEmail from './sendEmail';

const sendResetPasswordEmail = async (name: string, email: string, passToken: string) => {
  const frontendURL = process.env.ENV?.includes('dev')
    ? process.env.FRONTEND_DEVELOPMENT
    : process.env.FRONTEND_PRODUCTION;
  const resetURL = `${frontendURL}/user/reset-password?passToken=${passToken}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link : 
  <a href='${resetURL}'>Reset Password</a></p>`;

  return sendEmail(
    email,
    'Reset Password',
    `<h4>Hello, ${name}</h4>
   ${message}
   `,
  );
};

export default sendResetPasswordEmail;
