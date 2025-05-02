import { Post, PrismaClient } from '@prisma/client';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import {
  checkIfPostExist,
  getUserIfExistsByEmail,
} from '../../utils/checkIfExists';

const prisma = new PrismaClient();

const createOneIntoDB = async (
  payload: Post,
  userDecoded: JwtPayload,
): Promise<Post> => {
  const user = await getUserIfExistsByEmail(userDecoded.email);
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
  }
  const result = await prisma.post.create({
    data: {
      title: payload.title,
      description: payload.description,
      location: payload.location,
      priceRangeStart: payload.priceRangeStart,
      priceRangeEnd: payload.priceRangeEnd,
      pType: payload.pType,
      authorId: user.id,
      categoryId: payload.categoryId,
    },
  });
  return result;
};

const getAllFromDB = async (query: Record<string, unknown>) => {
  const postCategoryQueryBuilder = new QueryBuilder(prisma.post, query, [
    'name',
  ]);
  const result = await postCategoryQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();
  return result;
};

const getOneFromDB = async (pId: string): Promise<Post | null> => {
  await checkIfPostExist(pId);
  const result = await prisma.post.findFirst({
    where: { pId },
    include: {
      author: {
        select: {
          id: true,
          role: true,
          status: true,
          userDetails: {
            select: {
              name: true,
              profilePhoto: true,
            },
          },
        },
      },
      category: {
        select: {
          name: true,
          catId: true,
        },
      },
      approvedByAdmin: true,
      votes: true,
      comments: true,
    },
  });
  return result;
};

const updateOneIntoDB = async (
  pId: string,
  payload: Partial<Post>,
): Promise<Post | null> => {
  await checkIfPostExist(pId);
  const result = await prisma.post.update({
    where: { pId },
    data: payload,
  });
  return result;
};

const updatePostStatusIntoDB = async (
  pId: string,
  payload: Pick<Post, 'status'>,
): Promise<Post | null> => {
  await checkIfPostExist(pId);
  const result = await prisma.post.update({
    where: { pId },
    data: {
      status: payload.status,
    },
  });
  return result;
};

const deleteOneFromDB = async (pId: string): Promise<Post | void> => {
  await checkIfPostExist(pId);
  await prisma.post.delete({
    where: { pId },
  });
};

export const PostServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  updatePostStatusIntoDB,
  deleteOneFromDB,
};
