import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PostControllers } from './post.controller';
import { PostValidations } from './post.validation';
import auth from '../../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

// TODO: Needs to add images and its validation
router.post(
  '/',
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  upload.array('files', 10),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(PostValidations.createPostSchema),
  PostControllers.createOne,
);

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
