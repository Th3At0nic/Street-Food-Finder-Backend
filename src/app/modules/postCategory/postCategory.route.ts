import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PostCategoryControllers } from './postCategory.controller';
import { PostCategoryValidations } from './postCategory.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(PostCategoryValidations.createPostCategorySchema),
  PostCategoryControllers.createOne,
);

router.get('/', PostCategoryControllers.getAll);
router.get('/:id', PostCategoryControllers.getOne);

router.patch(
  '/:id',
  validateRequest(PostCategoryValidations.updatePostCategorySchema),
  PostCategoryControllers.updateOne,
);

router.delete('/:id', PostCategoryControllers.deleteOne);

export const PostCategoryRoutes = router;
