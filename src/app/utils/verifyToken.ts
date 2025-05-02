import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  const decodedData = jwt.verify(token, secret, {
    algorithms: ['HS256'],
  }) as JwtPayload;
  return decodedData;
};

export default verifyToken;
