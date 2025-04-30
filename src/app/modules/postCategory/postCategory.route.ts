import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PostCategoryControllers } from './postCategory.controller';
import { PostCategoryValidations } from './postCategory.validation';
import auth from '../../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(PostCategoryValidations.createPostCategorySchema),
  PostCategoryControllers.createOne,
);

router.get('/', PostCategoryControllers.getAll);
router.get('/:id', PostCategoryControllers.getOne);

router.patch(
  '/:id',
  auth(UserRole.ADMIN),
  validateRequest(PostCategoryValidations.updatePostCategorySchema),
  PostCategoryControllers.updateOne,
);

router.delete('/:id', PostCategoryControllers.deleteOne);

export const PostCategoryRoutes = router;
