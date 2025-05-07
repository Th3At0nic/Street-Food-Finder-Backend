import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VoteServices } from './vote.service';

const createOne = catchAsync(async (req, res) => {
  const result = await VoteServices.createOneIntoDB(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Vote created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await VoteServices.getAllFromDB(req.query, req.params.postId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Votes retrieved successfully',
    data: result,
  });
});

const getUserVote = catchAsync(async (req, res) => {
  const result = await VoteServices.getUserVoteFromDB(
    req.params.postId,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User vote retrieved successfully',
    data: result,
  });
});
const getVoteCounts = catchAsync(async (req, res) => {
  const result = await VoteServices.getVoteCountFromDB(req.params.postId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vote counts retrieved successfully',
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await VoteServices.updateOneIntoDB(
    req.params.postId,
    req.body,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vote updated successfully',
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  const result = await VoteServices.deleteOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vote deleted successfully',
    data: result,
  });
});

export const VoteControllers = {
  createOne,
  getAll,
  getUserVote,
  getVoteCounts,
  updateOne,
  deleteOne,
};
