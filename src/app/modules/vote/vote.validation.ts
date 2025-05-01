import { z } from 'zod';

const createVoteSchema = z.object({
  body: z.object({
    postId: z.string({ required_error: 'Post Id is required' }),
    vType: z.enum(['UPVOTE', 'DOWNVOTE'], {
      required_error: 'Vote type is required',
    }),
  }),
});

const updateVoteSchema = z.object({
  body: z.object({
    vType: z.enum(['UPVOTE', 'DOWNVOTE'], {
      required_error: 'Vote type is required',
    }),
  }),
});

export const VoteValidations = {
  createVoteSchema,
  updateVoteSchema,
};
