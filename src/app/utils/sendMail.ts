import nodemailer from 'nodemailer';
import config from '../config';
const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.nodeMailer.GoogleEmail,
      pass: config.nodeMailer.GooglePassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"For Reset Password Its Time Only 5 for PhHealth Care<iftakharalamshuvo11@gmail.com> min hurry up"', // sender address
    to: email, // list of receivers
    subject: 'Reset Password Link ✔', // Subject line
    //text: "", // plain text body
    html: html, // html body
  });

  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

export default emailSender;
