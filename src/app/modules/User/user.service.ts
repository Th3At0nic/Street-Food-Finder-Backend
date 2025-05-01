import { User, UserDetail } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import config from '../../config';
import bcrypt from 'bcrypt';

const createUserIntoDb = async (data: User & UserDetail) => {
  const hashedPassword: string = await bcrypt.hash(
    data.password,
    Number(config.bcrypt.bcryptSaltRounds),
  );
  const userPayload = {
    email: data.email,
    password: hashedPassword,
  };

  const result = await prisma.$transaction(async (tx) => {
    const userData = await tx.user.create({
      data: userPayload,
    });
    const createdUserDetails = await tx.userDetail.create({
      data: {
        userId: userData.id,
        name: data.name,
      },
      include: {
        user: true,
      },
    });
    return createdUserDetails;
  });
  const {
    id,
    user: { email, role, status },
    profilePhoto,
    contactNumber,
    createdAt,
    updatedAt,
  } = result;
  return {
    id,
    email,
    profilePhoto,
    contactNumber,
    role,
    status,
    createdAt,
    updatedAt,
  };
};

export const userService = {
  createUserIntoDb,
};
