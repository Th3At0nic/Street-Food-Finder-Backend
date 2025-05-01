import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { userService } from './user.service';

const insertUserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await userService.createUserIntoDb(data);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

export const userController = {
  insertUserIntoDB,
};
