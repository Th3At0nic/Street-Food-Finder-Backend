import { UserStatuses } from '@prisma/client';
import z from 'zod';

const updateStatus = z.object({
  body: z.object({
    status: z.enum([UserStatuses.ACTIVE, UserStatuses.BLOCKED]),
  }),
});

export const userValidation = {
  updateStatus,
};
