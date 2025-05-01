import {
  SubscriptionPlans,
  PrismaClient,
  SubscriptionStatus,
} from '@prisma/client';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { checkIfSubscriptionPlanExist } from '../../utils/checkIfExists';

const prisma = new PrismaClient();

const createOneIntoDB = async (
  payload: Pick<SubscriptionPlans, 'name' | 'fee' | 'duration'>,
): Promise<SubscriptionPlans> => {
  const result = await prisma.subscriptionPlans.create({
    data: payload,
  });
  return result;
};

const getAllFromDB = async (query: Record<string, unknown>) => {
  const subscriptionQueryBuilder = new QueryBuilder(
    prisma.subscriptionPlans,
    query,
    ['rating'],
  );
  const result = await subscriptionQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();
  return result;
};

const getOneFromDB = async (
  spId: string,
): Promise<SubscriptionPlans | null> => {
  await checkIfSubscriptionPlanExist(spId);
  const result = await prisma.subscriptionPlans.findFirst({
    where: { spId },
  });
  return result;
};

const updateOneIntoDB = async (
  spId: string,
  payload: Pick<SubscriptionPlans, 'name' | 'fee' | 'duration' | 'spId'>,
): Promise<SubscriptionPlans | null> => {
  await checkIfSubscriptionPlanExist(spId);
  const result = await prisma.subscriptionPlans.update({
    where: { spId },
    data: payload,
  });
  return result;
};

const deactivateOneFromDB = async (
  spId: string,
): Promise<SubscriptionPlans | void> => {
  await checkIfSubscriptionPlanExist(spId);
  await prisma.subscriptionPlans.update({
    where: { spId },
    data: { status: SubscriptionStatus.IN_ACTIVE },
  });
};

export const SubscriptionServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deactivateOneFromDB,
};
