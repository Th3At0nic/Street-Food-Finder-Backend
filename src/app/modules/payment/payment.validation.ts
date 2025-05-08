import { z } from 'zod';

// export const createPaymentSchema = z.object({
//   body: z.object({
//     userId: z.string({
//       required_error: 'userId is required',
//     }),
//     paymentId: z.string({
//       required_error: 'paymentId is required',
//     }),
//     amount: z.string({
//       required_error: 'amount is required',
//     }),
//   }),
// });

const updatePaymentSchema = z.object({
  body: z.object({}),
});

export const PaymentValidations = {
  // createPaymentSchema,
  updatePaymentSchema,
};
