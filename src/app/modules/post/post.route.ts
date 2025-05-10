/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PostControllers } from './post.controller';
import { PostValidations } from './post.validation';
import auth from '../../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';
import { upload } from '../../utils/sendImageToCloudinary';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import timeout from 'connect-timeout';

const router = express.Router();

// Guard middleware to break chain if request timed out
const haltOnTimedout = (req: any, res: any, next: any) => {
  if (req.timedout) {
    return next(new AppError(httpStatus.REQUEST_TIMEOUT, 'Request timed out'));
  }
  next();
};

// Safe JSON parse middleware
const parsePostData = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = JSON.parse(req.body.data);
    next();
  } catch (err) {
    next(
      new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid post data format. Please try again.',
      ),
    );
  }
};

// TODO: Needs to add images and its validation

router.post(
  '/',
  timeout('15s'), // 15 second max timeout for the whole request
  haltOnTimedout,
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  haltOnTimedout,
  upload.array('files', 10),
  haltOnTimedout,
  parsePostData,
  haltOnTimedout,
  validateRequest(PostValidations.createPostSchema),
  haltOnTimedout,
  PostControllers.createOne,
);
// router.post(
//   '/',
//   auth(UserRole.USER, UserRole.PREMIUM_USER),
//   upload.array('files', 10),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = JSON.parse(req.body.data);
//     next();
//   },
//   validateRequest(PostValidations.createPostSchema),
//   PostControllers.createOne,
// );

router.get('/', PostControllers.getAll);
router.get('/:id', PostControllers.getOne);

router.put(
  '/:id/status',
  auth(UserRole.ADMIN),
  validateRequest(PostValidations.updatePostStatusSchema),
  PostControllers.updatePostStatus,
);

router.patch(
  '/:id',
  auth(UserRole.ADMIN, UserRole.PREMIUM_USER, UserRole.USER),
  validateRequest(PostValidations.updatePostSchema),
  PostControllers.updateOne,
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN, UserRole.PREMIUM_USER, UserRole.USER),
  PostControllers.deleteOne,
);

export const PostRoutes = router;
