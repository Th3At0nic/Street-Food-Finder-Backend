import { PrismaClient, User } from '@prisma/client';
import NotFoundError from '../error/NotFoundError';

const prisma = new PrismaClient();

export const getUserIfExistsByEmail = async (
  email: string,
): Promise<User | null> => {
  return await prisma.user.findFirst({
    where: { email },
  });
};

export const checkIfPostExist = async (pId: string): Promise<void> => {
  if (
    !(await prisma.post.count({
      where: { pId },
    }))
  ) {
    throw new NotFoundError('Post category');
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
