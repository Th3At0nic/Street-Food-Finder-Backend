import { Comments, PrismaClient, UserRole } from '@prisma/client';
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
const getAllCommentsOfPostFromDB = async (
  query: Record<string, unknown>,
  postId: string,
) => {
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

const getAllFromDB = async (
  query: Record<string, unknown>,
  userDecoded: JwtPayload,
) => {
  const postCategoryQueryBuilder = new QueryBuilder(
    prisma.comments,
    query,
    ['comment'],
    'Comments',
  );
  const result = await postCategoryQueryBuilder
    .search()
    .filter(userDecoded && userDecoded.role === UserRole.ADMIN)
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
  payload: Pick<Comments, 'comment' | 'status' | 'commenterId'>,
  userDecoded: JwtPayload,
): Promise<Comments | null> => {
  const user = await getUserIfExistsByEmail(userDecoded.email);
  if (user.role === UserRole.ADMIN && payload.comment) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update comment text!',
    );
  }
  if (user.role !== UserRole.ADMIN) {
    payload.commenterId = user.id;
  }
  await checkIfCommentExist(cId);
  const result = await prisma.comments.update({
    where: {
      cId,
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
  getAllCommentsOfPostFromDB,
  getAllFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
