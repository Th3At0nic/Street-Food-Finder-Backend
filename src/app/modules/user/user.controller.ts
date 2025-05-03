import { Express, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { userService } from './user.service';
import pick from '../../../shared/pick';
import { userFilterAbleFields } from './user.const';
import { IAuthUser } from '../../interface/common';

const insertUserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const file = req?.file as Express.Multer.File;

  const data = req.body;

  const result = await userService.createUserIntoDb(file, data);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterAbleFields);

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await userService.getAllFromDb(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieval successfully',
    data: result,
  });
});

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userService.getSingleFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single User retrieval successfully',
    data: result,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const { id } = req.params;
  const result = await userService.updateStatus(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status changes successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await userService.getMyProfile(user as IAuthUser);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'My Profile data fetched successfully',
    data: result,
  });
});

export const userController = {
  insertUserIntoDB,
  getAllFromDB,
  getSingleFromDB,
  changeProfileStatus,
  getMyProfile,
};
