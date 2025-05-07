import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './comment.service';

const createOne = catchAsync(async (req, res) => {
  const result = await CommentServices.createOneIntoDB(
    req.body,
    req.user,
    req.params.postId,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment created successfully',
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await CommentServices.updateOneIntoDB(
    req.params.commentId,
    req.body,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment updated successfully',
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  const result = await CommentServices.deleteOneFromDB(
    req.params.commentId,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  });
});

const getOne = catchAsync(async (req, res) => {
  const result = await CommentServices.getOneFromDB(req.params.commentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment retrieved successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await CommentServices.getAllFromDB(
    req.query,
    req.params.postId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All comments retrieved successfully',
    data: result,
  });
});

export const CommentControllers = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
};
export default CommentControllers;
