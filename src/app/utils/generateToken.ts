import jwt, { Secret } from 'jsonwebtoken';

const generateToken = (
  payload: { email: string; role: string },
  secret: string | Secret,
  expiresIn: string,
) => {
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn });
  return token;
};

export default generateToken;
