import { Votes, PrismaClient, PostStatus } from '@prisma/client';
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

const createOneIntoDB = async (payload: Votes, userDecoded: JwtPayload) => {
  const user = await getUserIfExistsByEmail(userDecoded.email);
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
  }
  await checkIfPostExist(payload.postId, PostStatus.APPROVED);

  const checkIfVoteExist = await prisma.votes.findFirst({
    where: { vId: payload.vId, postId: payload.postId, voterId: user.id },
  });
  if (checkIfVoteExist) {
    if (checkIfVoteExist.vType === payload.vType) {
      return await deleteOneFromDB(checkIfVoteExist.vId);
    } else {
      const updatedResult = await prisma.votes.update({
        where: {
          vId: checkIfVoteExist.vId,
          voterId: user.id,
        },
        data: {
          vType: payload.vType,
        },
      });
      return updatedResult;
    }
  }
  const result = await prisma.votes.create({
    data: { ...payload, voterId: user.id },
  });
  return result;
};

const getAllFromDB = async (query: Record<string, unknown>, postId: string) => {
  const totalVotes = await prisma.votes.count();
  const upVoteCount = await prisma.votes.count({
    where: {
      postId,
      vType: 'UPVOTE',
    },
  });
  const downVoteCount = await prisma.votes.count({
    where: {
      postId,
      vType: 'DOWNVOTE',
    },
  });
  query.postId = postId;
  const postCategoryQueryBuilder = new QueryBuilder(prisma.votes, query, [
    'vType',
  ]);
  const result = await postCategoryQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();
  return {
    votes: result.data,
    meta: { totalVotes, upVoteCount, downVoteCount, ...result.meta },
  };
};

const getVoteCountFromDB = async (postId: string) => {
  const upVoteCount = await prisma.votes.count({
    where: {
      postId,
      vType: 'UPVOTE',
    },
  });
  const downVoteCount = await prisma.votes.count({
    where: {
      postId,
      vType: 'DOWNVOTE',
    },
  });
  return { upVoteCount, downVoteCount };
};
const getUserVoteFromDB = async (postId: string, userDecoded: JwtPayload) => {
  const result = await prisma.votes.findFirst({
    where: {
      postId,
      voterId: userDecoded.id,
    },
  });
  return result;
};

const updateOneIntoDB = async (
  postId: string,
  payload: Pick<Votes, 'vType'>,
  userDecoded: JwtPayload,
): Promise<Votes | null> => {
  const user = await getUserIfExistsByEmail(userDecoded.email);
  await checkIfPostExist(postId);
  const result = await prisma.votes.update({
    where: {
      postId_voterId: {
        postId,
        voterId: user.id,
      },
    },
    data: payload,
  });
  return result;
};

const deleteOneFromDB = async (vId: string): Promise<Votes | void> => {
  await checkIfVoteExist(vId);
  await prisma.votes.delete({
    where: { vId },
  });
};

export const VoteServices = {
  createOneIntoDB,
  getAllFromDB,
  getVoteCountFromDB,
  getUserVoteFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
