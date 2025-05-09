import { z } from 'zod';
const PostTypes = z.enum(['NORMAL', 'PREMIUM']);
const PostStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

const createPostSchema = z.object({
  body: z.object({
    categoryId: z.string({ required_error: 'Category is required' }),
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
    pType: PostTypes.optional(),
    status: PostStatus.optional(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    priceRangeStart: z.number().min(0).optional(),
    priceRangeEnd: z.number().optional(),
    location: z.string().optional(),
  }),
});
enum ZPostStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

const updatePostStatusSchema = z.object({
  body: z
    .object({
      status: z.nativeEnum(ZPostStatus),
      rejectReason: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.status === ZPostStatus.REJECTED && !data.rejectReason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'rejectReason is required when status is REJECTED',
          path: ['rejectReason'],
        });
      }
    }),
});

export const PostValidations = {
  createPostSchema,
  updatePostSchema,
  updatePostStatusSchema,
};
