import { z } from 'zod';

const createPostRatingSchema = z.object({
  body: z.object({
    postId: z.string({ required_error: 'Name is required' }),
    rating: z.number({ required_error: 'Rating is required' }).min(1).max(5),
  }),
});

const updatePostRatingSchema = z.object({
  body: z.object({
    rating: z.number({ required_error: 'Rating is required' }).min(1).max(5),
  }),
});

export const PostRatingValidations = {
  createPostRatingSchema,
  updatePostRatingSchema,
};
