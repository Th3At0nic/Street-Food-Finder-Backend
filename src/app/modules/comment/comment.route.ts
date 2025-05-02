import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CommentControllers } from './comment.controller';

import auth from '../../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';
import {
  createCommentSchema,
  deleteCommentSchema,
  getAllCommentsSchema,
  getCommentSchema,
  updateCommentSchema,
} from './comment.vallidation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER),
  validateRequest(createCommentSchema),
  CommentControllers.createOne,
);

router.patch(
  '/',
  auth(UserRole.USER),
  validateRequest(updateCommentSchema),
  CommentControllers.updateOne,
);

router.delete(
  '/',
  auth(UserRole.USER),
  validateRequest(deleteCommentSchema),
  CommentControllers.deleteOne,
);

router.get('/', validateRequest(getCommentSchema), CommentControllers.getOne);

router.get(
  '/all',
  validateRequest(getAllCommentsSchema),
  CommentControllers.getAll,
);

export const CommentRoutes = router;
