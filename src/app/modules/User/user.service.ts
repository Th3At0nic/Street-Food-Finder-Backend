import { prisma } from '../../../shared/prisma';
import config from '../../config';
import { Iusers } from './user.interface';
import bcrypt from 'bcrypt';

const createUserIntoDb = async (data: Iusers) => {
  const hashedPassword: string = await bcrypt.hash(
    data.password,
    Number(config.bcrypt.bcryptSaltRounds),
  );
  const userPayload = {
    ...data,
    password: hashedPassword,
  };
  const result = await prisma.$transaction(async (tx) => {
    const userData = await tx.user.create({
      data: userPayload,
    });
    const creataedUserDetails = await tx.userDetail.create({
      data: {
        userId: userData.id,
      },
      include: {
        user: true,
      },
    });
    return creataedUserDetails;
  });
  return result;
};

export const userService = {
  createUserIntoDb,
};
