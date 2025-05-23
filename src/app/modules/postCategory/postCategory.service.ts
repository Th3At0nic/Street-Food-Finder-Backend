import { PostCategory, PrismaClient } from '@prisma/client';
import { QueryBuilder } from '../../builder/QueryBuilder';
import NotFoundError from '../../error/NotFoundError';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const prisma = new PrismaClient();

const checkIfPostCategoryExist = async (catId: string): Promise<void> => {
  if (
    !(await prisma.postCategory.count({
      where: { catId },
    }))
  ) {
    throw new NotFoundError('Post category');
  }
};

const createOneIntoDB = async (
  payload: Pick<PostCategory, 'name'>,
): Promise<PostCategory> => {
  const result = await prisma.postCategory.create({
    data: payload,
  });
  return result;
};

const getAllFromDB = async (query: Record<string, unknown>) => {
  const postCategoryQueryBuilder = new QueryBuilder(
    prisma.postCategory,
    query,
    ['name'],
  );
  const result = await postCategoryQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();
  return result;
};

const getOneFromDB = async (catId: string): Promise<PostCategory | null> => {
  await checkIfPostCategoryExist(catId);
  const result = await prisma.postCategory.findFirst({
    where: { catId },
  });
  return result;
};

const updateOneIntoDB = async (
  catId: string,
  payload: Pick<PostCategory, 'name'>,
): Promise<PostCategory | null> => {
  await checkIfPostCategoryExist(catId);
  const result = await prisma.postCategory.update({
    where: { catId },
    data: payload,
  });
  return result;
};

const deleteOneFromDB = async (catId: string): Promise<PostCategory | void> => {
  await checkIfPostCategoryExist(catId);
  try {
    await prisma.postCategory.delete({
      where: { catId },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You can't delete this category as other post are referencing it!",
      );
    }
  }
};

export const PostCategoryServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
};
