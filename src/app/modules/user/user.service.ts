/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Prisma,
  User,
  UserDetail,
  UserRole,
  UserStatuses,
} from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import config from '../../config';
import bcrypt from 'bcrypt';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { calculatePagination } from '../../utils/pagination.utils';
import { IOptions } from '../../interface/pagination.type';
import { userSearchAbleField } from './user.const';
import { IAuthUser } from '../../interface/common';
import { getUserIfExistsByEmail } from '../../utils/checkIfExists';
import { loginUser } from '../auth/auth.service';

const createUserIntoDb = async (
  file: Express.Multer.File,
  data: User & UserDetail,
) => {
  let uploadedImageUrl: string;
  if (file) {
    const imgName = `${data.email}-${Date.now()}`;

    const uploadImgResult = await sendImageToCloudinary(file.buffer, imgName);
    if (uploadImgResult?.secure_url) {
      uploadedImageUrl = await uploadImgResult.secure_url;
    }
  } else if (data.profilePhoto) {
    try {
      const user = await getUserIfExistsByEmail(data.email);
      return loginUser({ email: user.email, password: user.password }, true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (err) {}
    uploadedImageUrl = data.profilePhoto;
  }

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
        profilePhoto: uploadedImageUrl || null,
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

const getAllFromDb = async (params: any, options: IOptions) => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleField.map((field) => {
        return {
          [field]: {
            contains: params.searchTerm,
            mode: 'insensitive',
          },
        };
      }),
    });
  }
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    select: {
      id: true,
      email: true,
      status: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      UserSubscriptions: true,
      Payments: true,
      comments: true,
      Votes: true,
      authoredPosts: true,
      approvedPosts: true,
      userDetails: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleFromDb = async (id: string): Promise<User> => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
      status: UserStatuses.ACTIVE,
    },
  });
  return isUserExist;
};
const updateStatus = async (
  id: string,
  payload: { status: UserStatuses },
): Promise<User> => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });
  return updateUser;
};

const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatuses.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });
  let profileInfo;
  if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        userDetails: true,
        Payments: true,
        UserSubscriptions: true,
      },
    });
  } else if (userInfo.role === UserRole.USER) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        userDetails: true,
        Payments: true,
        UserSubscriptions: true,
      },
    });
  } else if (userInfo.role === UserRole.PREMIUM_USER) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        userDetails: true,
        Payments: true,
        UserSubscriptions: true,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};
export const userService = {
  createUserIntoDb,
  getAllFromDb,
  getSingleFromDb,
  updateStatus,
  getMyProfile,
};
