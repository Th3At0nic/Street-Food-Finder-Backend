import { PostRatings, PrismaClient } from '@prisma/client';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import {
  checkIfPostExist,
  checkIfVoteExist,
  getUserIfExistsByEmail,
} from '../../utils/checkIfExists';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const prisma = new PrismaClient();

const createOneIntoDB = async (
  payload: PostRatings,
  userDecoded: JwtPayload,
): Promise<PostRatings> => {
  const user = await getUserIfExistsByEmail(userDecoded.email);
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
  }
  payload.ratedBy = user.id;
  await checkIfPostExist(payload.postId);

  const checkIfPostRatingsExist = await prisma.postRatings.findFirst({
    where: { prId: payload.prId, ratedBy: payload.ratedBy },
  });
  if (checkIfPostRatingsExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already rated this post',
    );
  }
  const result = await prisma.postRatings.create({
    data: payload,
  });
  return result;
};

const getAllFromDB = async (query: Record<string, unknown>) => {
  const postCategoryQueryBuilder = new QueryBuilder(prisma.postRatings, query, [
    'rating',
  ]);
  const result = await postCategoryQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();
  return result;
};

const getOneFromDB = async (prId: string): Promise<PostRatings | null> => {
  await checkIfVoteExist(prId);
  const result = await prisma.postRatings.findFirst({
    where: { prId },
  });
  return result;
};

const updateOneIntoDB = async (
  prId: string,
  payload: Pick<PostRatings, 'rating'>,
): Promise<PostRatings | null> => {
  await checkIfVoteExist(prId);
  const result = await prisma.postRatings.update({
    where: { prId },
    data: payload,
  });
  return result;
};

const deleteOneFromDB = async (prId: string): Promise<PostRatings | void> => {
  await checkIfVoteExist(prId);
  await prisma.postRatings.delete({
    where: { prId },
  });
};

export const PostRatingServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
