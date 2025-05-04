import jwt, { Secret } from 'jsonwebtoken';

const generateToken = (
  payload: {
    id: string;
    name: string;
    email: string;
    role: string;
  },
  secret: Secret,
  expiresIn: string,
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
    algorithm: 'HS256',
  });
  return token;
};

export default generateToken;
