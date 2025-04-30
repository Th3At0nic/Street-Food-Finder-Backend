import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { authService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await authService.loginUser(data);
  const { refreshToken } = result;
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'log in sucessfully',
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needsPasswordChange,
    },
  });
});

export const authController = {
  loginUser,
};
