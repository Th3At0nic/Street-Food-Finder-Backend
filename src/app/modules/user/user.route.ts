import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { upload } from '../../utils/sendImageToCloudinary';

const route = express.Router();

route.post(
  '/',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userController.insertUserIntoDB,
); // cloudinery work

export const UserRoutes = route;
