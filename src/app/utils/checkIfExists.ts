import { PostStatus, PrismaClient, User } from '@prisma/client';
import NotFoundError from '../error/NotFoundError';
import AppError from '../error/AppError';
import httpStatus from 'http-status';

const prisma = new PrismaClient();

export const getUserIfExistsByEmail = async (email: string): Promise<User> => {
  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
  return user;
};

export const checkIfPostExist = async (
  pId: string,
  status: PostStatus | null = null,
): Promise<void> => {
  if (status) {
    if (
      !(await prisma.post.count({
        where: { pId, status },
      }))
    ) {
      throw new NotFoundError('Post');
    }
  }
  if (
    !(await prisma.post.count({
      where: { pId },
    }))
  ) {
    throw new NotFoundError('Post');
  }
};

export const checkIfCommentExist = async (cId: string): Promise<void> => {
  if (
    !(await prisma.comments.count({
      where: { cId },
    }))
  ) {
    throw new NotFoundError('Comment');
  }
};

export const checkIfPostRatingsExist = async (prId: string): Promise<void> => {
  if (
    !(await prisma.postRatings.count({
      where: { prId },
    }))
  ) {
    throw new NotFoundError('Post rating');
  }
};

export const checkIfVoteExist = async (vId: string): Promise<void> => {
  if (
    !(await prisma.votes.count({
      where: { vId },
    }))
  ) {
    throw new NotFoundError('Vote');
  }
};

export const checkIfPostRatingExist = async (prId: string): Promise<void> => {
  if (
    !(await prisma.postRatings.count({
      where: { prId },
    }))
  ) {
    throw new NotFoundError('Post rating');
  }
};

export const checkIfSubscriptionPlanExist = async (
  spId: string,
): Promise<void> => {
  if (
    !(await prisma.subscriptionPlans.count({
      where: { spId },
    }))
  ) {
    throw new NotFoundError('Subscription plan');
  }
};
