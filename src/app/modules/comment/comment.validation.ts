import { CommentStatus } from '@prisma/client';
import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    comment: z.string().min(1, 'Comment is required'),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    comment: z.string().min(1, 'Comment is required').optional(),
    status: z
      .enum([
        CommentStatus.APPROVED,
        CommentStatus.REJECTED,
        CommentStatus.PENDING,
      ])
      .optional(),
  }),
});
