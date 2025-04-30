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
  bcrypt: {
    bcryptSaltRounds: process.env.BCRYPT_SALT_ROUND,
  },
};
