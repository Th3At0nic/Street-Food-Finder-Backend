import { z } from 'zod';

export const createCommentSchema = z.object({
  postId: z.string().uuid(),
  commenterId: z.string().uuid(),
  comment: z.string().min(1, 'Comment is required'),
});

export const updateCommentSchema = z.object({
  commentId: z.string().uuid(),
  comment: z.string().min(1, 'Comment is required'),
});

export const deleteCommentSchema = z.object({
  commentId: z.string().uuid(),
});

export const getCommentSchema = z.object({
  postId: z.string().uuid(),
  commenterId: z.string().uuid(),
});

export const getAllCommentsSchema = z.object({
  postId: z.string().uuid(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
