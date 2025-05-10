import { Post, PostStatus, PrismaClient } from '@prisma/client';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import {
  checkIfPostExist,
  getUserIfExistsByEmail,
} from '../../utils/checkIfExists';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const prisma = new PrismaClient();

const createOneIntoDB = async (
  files: Express.Multer.File[],
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

  if (files && files.length > 0) {
    // const uploadedImages: string[] = [];

    // Upload each file to Cloudinary
    for (const file of files) {
      const imgName = `${Math.random().toString(36).substring(2, 10)}-${Date.now()}`;

      // const imgPath = file.path;

      const uploadImgResult = await sendImageToCloudinary(file.buffer, imgName);
      if (uploadImgResult?.secure_url) {
        // uploadedImages.push(uploadImgResult.secure_url);
        await prisma.postImages.create({
          data: {
            postId: result.pId,
            file_path: uploadImgResult.secure_url,
          },
        });
      }
    }
  }

  return result;
};

const getAllFromDB = async (query: Record<string, unknown>) => {
  const postCategoryQueryBuilder = new QueryBuilder(
    prisma.post,
    query,
    ['name'],
    'Post',
  );
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
      postImages: true,
      postRatings: true,
      _count: true,
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
  payload: Pick<Post, 'status' | 'rejectReason'>,
): Promise<Post | null> => {
  await checkIfPostExist(pId);
  if (payload.status === PostStatus.APPROVED) {
    payload.rejectReason = null;
  }
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
