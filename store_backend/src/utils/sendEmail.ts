//ignore
import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, html: string) => {
  //let testAccount = await createTestAccount();

  let transporter = nodemailer.createTransport({
    // @ts-ignore
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  let mailOptions = {
    from: 'mohabisback@gmail.com', // sender address
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(`Can't send Email: ` + err);
    } else {
      console.log('Email sent successfully');
    }
  });
};

export default sendEmail;
