import { z } from 'zod';
const PostTypes = z.enum(['NORMAL', 'PREMIUM']);
const PostStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

const createPostSchema = z.object({
  body: z.object({
    categoryId: z.string({ required_error: 'Category is required' }),
    authorId: z.string({ required_error: 'Author is required' }),
    title: z.string().min(1),
    description: z.string({ required_error: 'Description is required' }).min(1),
    priceRangeStart: z
      .number({ required_error: 'Price range start is required' })
      .min(0),
    priceRangeEnd: z.number({
      required_error: 'Price range end is required',
    }),
    location: z.string({ required_error: 'Location is required' }),
  }),
});

const updatePostSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    authorId: z.string().optional(),
    pType: PostTypes.optional(),
    status: PostStatus.optional(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    priceRangeStart: z.number().min(0).optional(),
    priceRangeEnd: z.number().optional(),
    location: z.string().optional(),
  }),
});

const updatePostStatusSchema = z.object({
  body: z.object({
    status: PostStatus,
  }),
});

export const PostValidations = {
  createPostSchema,
  updatePostSchema,
  updatePostStatusSchema,
};
