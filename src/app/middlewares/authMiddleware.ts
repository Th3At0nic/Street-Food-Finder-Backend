import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import config from '../config';
import AppError from '../error/AppError';
import verifyToken from '../utils/verifyToken';

const auth = (...role: string[]) => {
  return async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(status.UNAUTHORIZED, 'you are not authorized');
      }
      const actualToken = token.split(' ')[1];
      const verifiedUser = verifyToken(
        actualToken as string,
        config.jwt.jwtAccessToken as string,
      );

      req.user = verifiedUser;
      if (role.length && !role.includes(verifiedUser.role)) {
        throw new AppError(status.FORBIDDEN, 'you are not authorized');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
