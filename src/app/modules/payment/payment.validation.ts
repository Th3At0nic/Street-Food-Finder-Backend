import { z } from 'zod';

const createPaymentSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'userId is required',
    }),
    paymentId: z.string({
      required_error: 'paymentId is required',
    }),
    amount: z.string({
      required_error: 'amount is required',
    }),
  }),
});

const updatePaymentSchema = z.object({
  body: z.object({
    paymentStatus: z.enum(['PAID', 'PENDING']).optional(),
    amount: z.string().optional(),
  }),
});

const verifyPaymentSchema = z.object({
  body: z.object({
    spOrderId: z.string({
      required_error: 'spOrderId is required',
    }),
  }),
});

const webhookCallbackSchema = z.object({
  body: z.object({
    order_id: z.string(),
    transaction_status: z.string(),
    sp_code: z.string().or(z.number()).optional(),
    sp_message: z.string().optional(),
    bank_status: z.string().optional(),
    method: z.string().optional(),
    date_time: z.string().optional(),
  }),
});

export const PaymentValidations = {
  createPaymentSchema,
  updatePaymentSchema,
  verifyPaymentSchema,
  webhookCallbackSchema,
};
