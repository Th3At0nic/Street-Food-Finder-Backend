import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostRatingServices } from './postRating.service';

const createOne = catchAsync(async (req, res) => {
  const result = await PostRatingServices.createOneIntoDB(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post rating created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await PostRatingServices.getAllFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post ratings retrieved successfully',
    data: result,
  });
});

const getMyRating = catchAsync(async (req, res) => {
  const result = await PostRatingServices.getMyRatingFromDB(
    req.params.postId,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post rating retrieved successfully',
    data: result,
  });
});

const getOne = catchAsync(async (req, res) => {
  const result = await PostRatingServices.getOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My post rating retrieved successfully',
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await PostRatingServices.updateOneIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post rating updated successfully',
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  const result = await PostRatingServices.deleteOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post rating deleted successfully',
    data: result,
  });
});

export const PostRatingControllers = {
  createOne,
  getAll,
  getMyRating,
  getOne,
  updateOne,
  deleteOne,
};
