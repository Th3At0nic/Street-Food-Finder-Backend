import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { upload } from '../../utils/sendImageToCloudinary';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';

const route = express.Router();
route.get('/', auth(UserRole.ADMIN), userController.getAllFromDB);

route.get(
  '/me',
  auth(UserRole.ADMIN, UserRole.PREMIUM_USER, UserRole.USER),
  userController.getMyProfile,
);

route.get('/:id', userController.getSingleFromDB);

// registration route
route.post(
  '/',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  userController.insertUserIntoDB,
);

route.patch(
  '/:id/status',
  auth(UserRole.ADMIN),
  validateRequest(userValidation.updateStatus),
  userController.changeProfileStatus,
);

// route.patch(
//   '/update-my-profile',
//   auth(UserRole.ADMIN, UserRole.PREMIUM_USER, UserRole.USER),

// );
// Update profile rahat bhai work

export const UserRoutes = route;
