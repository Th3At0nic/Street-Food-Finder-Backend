import { z } from 'zod';

/**
 * Schema for creating a subscription plan (admin use)
 */
export const createSubscriptionSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  fee: z.union([
    z.string().refine((val) => !isNaN(Number(val)), {
      message: 'Fee must be a valid number string',
    }),
    z.number(),
  ]),
  duration: z.number().int().min(1, { message: 'Duration must be at least 1 day' }),
});

/**
 * Schema for user subscribing to a plan (after payment success)
 */
export const userSubscribeSchema = z.object({
  subscriptionId: z.string().uuid({ message: 'Invalid subscription ID format' }),
  userId: z.string().uuid({ message: 'Invalid user ID format' }),
});

// ✅ Export inferred types (optional, for cleaner controller usage)
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UserSubscribeInput = z.infer<typeof userSubscribeSchema>;
