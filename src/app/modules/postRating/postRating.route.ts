import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PostRatingControllers } from './postRating.controller';
import { PostRatingValidations } from './postRating.validation';
import auth from '../../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  validateRequest(PostRatingValidations.createPostRatingSchema),
  PostRatingControllers.createOne,
);

router.get(
  '/my-rating/:postId',
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  PostRatingControllers.getMyRating,
);

router.get('/', PostRatingControllers.getAll);
router.get('/:id', PostRatingControllers.getOne);

router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  validateRequest(PostRatingValidations.updatePostRatingSchema),
  PostRatingControllers.updateOne,
);

router.delete('/:id', auth(UserRole.ADMIN), PostRatingControllers.deleteOne);

export const PostRatingRoutes = router;
