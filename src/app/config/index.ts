import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_uri: process.env.DATABASE_URI,
  jwt: {
    jwtAccessToken: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRATION,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  },
  resetPasswordCredential: {
    resetPasswordSecret: process.env.RESET_PASSWORD_TOKEN,
    resetTokenExpireIn: process.env.RESET_EXPIRES_IN,
    resetPasswordLink: process.env.RESET_PASSWORD_LINK,
  },
  bcrypt: {
    bcryptSaltRounds: process.env.BCRYPT_SALT_ROUND,
  },
  nodeMailer: {
    GooglePassword: process.env.SEND_MAIL_PASSWORD,
    GoogleEmail: process.env.SEND_MAIL_EMAIL,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  admin_password: process.env.ADMIN_PASSWORD,
};
