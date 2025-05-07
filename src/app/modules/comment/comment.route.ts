import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CommentControllers } from './comment.controller';

import auth from '../../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';
import { createCommentSchema, updateCommentSchema } from './comment.validation';

const router = express.Router();

router.post(
  '/:postId',
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  validateRequest(createCommentSchema),
  CommentControllers.createOne,
);

router.get('/post/:postId', CommentControllers.getAll);

router.get('/:commentId', CommentControllers.getOne);

router.patch(
  '/:commentId',
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  validateRequest(updateCommentSchema),
  CommentControllers.updateOne,
);

router.delete(
  '/:commentId',
  auth(UserRole.USER, UserRole.PREMIUM_USER, UserRole.ADMIN),
  CommentControllers.deleteOne,
);

export const CommentRoutes = router;
