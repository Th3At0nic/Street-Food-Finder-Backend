import { UserStatuses } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import bcrypt from 'bcrypt';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import config from '../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import generateToken from '../../utils/generateToken';
import verifyToken from '../../utils/verifyToken';

const loginUser = async (payload: { email: string; password: string }) => {
  //check is user data exist
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatuses.ACTIVE,
    },
  });
  // check is password correct
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Your password is not correct');
  }
  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwtAccessToken as Secret,
    config.jwt.jwtExpiresIn as string,
  );
  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refreshTokenSecret as Secret,
    config.jwt.refreshExpiresIn as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(
      token,
      config.jwt.refreshTokenSecret as Secret,
    ) as JwtPayload;
  } catch (error) {
    if (error) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatuses.ACTIVE,
    },
  });
  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwtAccessToken as Secret,
    config.jwt.jwtExpiresIn as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  loginUser,
  refreshToken,
};
