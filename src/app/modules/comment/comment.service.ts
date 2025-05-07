import { Comments, PrismaClient } from '@prisma/client';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import {
  checkIfCommentExist,
  checkIfPostExist,
  getUserIfExistsByEmail,
} from '../../utils/checkIfExists';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const prisma = new PrismaClient();

const createOneIntoDB = async (
  payload: Comments,
  userDecoded: JwtPayload,
  postId: string,
) => {
  const user = await getUserIfExistsByEmail(userDecoded.email);
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
  }
  payload.commenterId = user.id;
  payload.postId = postId;
  await checkIfPostExist(payload.postId);
  const result = await prisma.comments.create({
    data: payload,
    include: {
      commenter: {
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
    },
  });
  return result;
};

const getAllFromDB = async (query: Record<string, unknown>, postId: string) => {
  query.postId = postId;
  const postCategoryQueryBuilder = new QueryBuilder(
    prisma.comments,
    query,
    ['postId'],
    'Comments',
  );
  const result = await postCategoryQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();
  return result;
};

const getOneFromDB = async (commentId: string) => {
  const result = await prisma.comments.findFirst({
    where: {
      cId: commentId,
    },
    include: {
      post: true,
      commenter: {
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
    },
  });
  return result;
};

const updateOneIntoDB = async (
  cId: string,
  payload: Pick<Comments, 'comment'>,
  userDecoded: JwtPayload,
): Promise<Comments | null> => {
  const user = await getUserIfExistsByEmail(userDecoded.email);
  await checkIfCommentExist(cId);
  const result = await prisma.comments.update({
    where: {
      cId,
      commenterId: user.id,
    },
    data: payload,
  });
  return result;
};

const deleteOneFromDB = async (
  cId: string,
  userDecoded: JwtPayload,
): Promise<Comments | void> => {
  await checkIfCommentExist(cId);
  try {
    await prisma.comments.delete({
      where: { cId, commenterId: userDecoded.id },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
  }
};

export const CommentServices = {
  createOneIntoDB,
  getOneFromDB,
  getAllFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
