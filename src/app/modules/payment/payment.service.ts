import { Payment, PrismaClient } from '@prisma/client';
import { QueryBuilder } from '../../builder/QueryBuilder';
import NotFoundError from '../../error/NotFoundError';

const prisma = new PrismaClient();

const checkIfPaymentExist = async (pmId: string): Promise<void> => {
  if (
    !(await prisma.payment.count({
      where: { pmId },
    }))
  ) {
    throw new NotFoundError('Post category');
  }
};

const createOneIntoDB = async (payload: Payment): Promise<Payment> => {
  const result = await prisma.payment.create({
    data: payload,
  });
  return result;
};

const getAllFromDB = async (query: Record<string, unknown>) => {
  const postCategoryQueryBuilder = new QueryBuilder(prisma.payment, query, [
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

const getOneFromDB = async (pmId: string): Promise<Payment | null> => {
  await checkIfPaymentExist(pmId);
  const result = await prisma.payment.findFirst({
    where: { pmId },
  });
  return result;
};

const updateOneIntoDB = async (
  pmId: string,
  payload: Payment,
): Promise<Payment | null> => {
  await checkIfPaymentExist(pmId);
  const result = await prisma.payment.update({
    where: { pmId },
    data: payload,
  });
  return result;
};

const deleteOneFromDB = async (pmId: string): Promise<Payment | void> => {
  await checkIfPaymentExist(pmId);
  await prisma.payment.delete({
    where: { pmId },
  });
};

export const PaymentServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
