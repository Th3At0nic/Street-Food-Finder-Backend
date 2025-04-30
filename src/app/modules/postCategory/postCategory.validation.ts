import { z } from 'zod';

const createPostCategorySchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
  }),
});

const updatePostCategorySchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
  }),
});

export const PostCategoryValidations = {
  createPostCategorySchema,
  updatePostCategorySchema,
};
