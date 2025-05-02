import { UserStatuses } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import bcrypt from 'bcrypt';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import config from '../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import generateToken from '../../utils/generateToken';
import verifyToken from '../../utils/verifyToken';
import emailSender from '../../utils/sendMail';

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
const changePassword = async (
  user: { email: string },
  payload: { oldPassword: string; newPassword: string },
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatuses.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password,
  );
  if (!isCorrectPassword) {
    throw new Error('password incorect');
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt.bcryptSaltRounds),
  );
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needsPasswordChange: false,
    },
  });
  return {
    message: 'password changed successfully',
  };
};
const forgotPassword = async (payload: { email: string }) => {
  const userExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatuses.ACTIVE,
    },
  });
  const resetPasswordToken = generateToken(
    { email: userExist.email, role: userExist.role },
    config.resetPasswordCredential.resetPasswordSecret as Secret,
    config.resetPasswordCredential.resetTokenExpireIn as string,
  );
  const resetLink =
    config.resetPasswordCredential.resetPasswordLink +
    `?email=${userExist.email}&token=${resetPasswordToken}`;

  await emailSender(
    userExist.email,

    `
      <div>
        <h1>Reset Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">
        <button>
        Reset Password
        </button>
        </a>
      </div>
      `,
  );
};
const resetPassword = async (
  payload: {
    email: string;
    newPassword: string;
  },
  token: string,
) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatuses.ACTIVE,
    },
  });
  const isValidToken = verifyToken(
    token,
    config.resetPasswordCredential.resetPasswordSecret as Secret,
  ) as JwtPayload;
  if (!isValidToken) {
    throw new AppError(httpStatus.FORBIDDEN, 'forbidden');
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt.bcryptSaltRounds),
  );
  await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      password: hashedPassword,
      needsPasswordChange: false,
    },
  });
};

export const authService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
