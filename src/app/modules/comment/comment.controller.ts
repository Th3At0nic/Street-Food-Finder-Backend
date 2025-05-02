import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
// import { CommentServices } from './comment.service'; todo

const createOne = catchAsync(async (req, res) => {
  //   const result = await CommentServices.createOneIntoDB(req.body); todo
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment created successfully',
    // data: result, todo
  });
});

const updateOne = catchAsync(async (req, res) => {
  //   const result = await CommentServices.updateOneIntoDB(req.body.commentId, req.body.comment); todo
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment updated successfully',
    // data: result, todo
  });
});

const deleteOne = catchAsync(async (req, res) => {
  //   const result = await CommentServices.deleteOneFromDB(req.body.commentId); todo
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully',
    // data: result,  todo
  });
});

const getOne = catchAsync(async (req, res) => {
  //   const result = await CommentServices.getOneFromDB(req.query.postId as string, req.query.commenterId as string); todo`
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment retrieved successfully',
    // data: result,  todo
  });
});

const getAll = catchAsync(async (req, res) => {
  //   const result = await CommentServices.getAllFromDB(req.query); todo
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All comments retrieved successfully',
    // data: result, todo
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
