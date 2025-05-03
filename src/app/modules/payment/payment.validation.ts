import { z } from 'zod';

const createPaymentSchema = z.object({
  body: z.object({}),
});

const updatePaymentSchema = z.object({
  body: z.object({}),
});

export const PaymentValidations = {
  createPaymentSchema,
  updatePaymentSchema,
};
