import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
const verifyToken = (token: string, secret: Secret) => {
  const decodedData = jwt.verify(token, secret) as JwtPayload;
  return decodedData;
};

export default verifyToken;
