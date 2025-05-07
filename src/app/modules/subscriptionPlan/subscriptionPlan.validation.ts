import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, { message: 'Name is required' }),
    fee: z.union([
      z
        .string({ required_error: 'Fee is required' })
        .refine((val) => !isNaN(Number(val)), {
          message: 'Fee must be a valid number string',
        }),
      z.number().min(0, { message: 'Fee is required' }),
    ]),
    duration: z
      .number()
      .int()
      .min(15, { message: 'Duration must be at least 15 days' }),
  }),
});

/**
 * Schema for user subscribing to a plan (after payment success)
 */
export const updateSubscriptionSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    fee: z
      .union([
        z.string().refine((val) => !isNaN(Number(val)), {
          message: 'Fee must be a valid number string',
        }),
        z.number(),
      ])
      .optional(),
    duration: z
      .number()
      .int()
      .min(15, { message: 'Duration must be at least 15 days' })
      .optional(),
  }),
});

/**
 * Schema for user subscribing to a plan (after payment success)
 */
export const userSubscribeSchema = z.object({
  body: z.object({
    subscriptionId: z.string({ message: 'Invalid subscription ID format' }),
  }),
});

// ✅ Export inferred types (optional, for cleaner controller usage)
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UserSubscribeInput = z.infer<typeof userSubscribeSchema>;
