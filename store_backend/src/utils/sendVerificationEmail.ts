import sendEmail from './sendEmail';

const sendVerificationEmail = async (name: string, email: string, verifyToken: string) => {
  const frontendURL = process.env.ENV?.includes('dev')
    ? process.env.FRONTEND_DEVELOPMENT
    : process.env.FRONTEND_PRODUCTION;
  const verifyEmail = `${frontendURL}/user/verify-email?token=${verifyToken}&email=${email}`;

  const message = `
  <h4> Welcome, ${name}</h4>
  <p>You have registered successfully in ${frontendURL}</p>
  <p>Please confirm your email by clicking on the following link : 
  <a href='${verifyEmail}'>Verify My Email</a> </p>
  `;

  return sendEmail(email, 'Email Confirmation', message);
};

export default sendVerificationEmail;
