import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentControllers } from './payment.controller';
import { PaymentValidations } from './payment.validation';
import auth from '../../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER),
  validateRequest(PaymentValidations.createPaymentSchema),
  PaymentControllers.createOne,
);

router.get(
  '/',
  auth(UserRole.USER, UserRole.PREMIUM_USER, UserRole.ADMIN),
  PaymentControllers.getAll,
);
router.get(
  '/:id',
  auth(UserRole.USER, UserRole.PREMIUM_USER, UserRole.ADMIN),
  PaymentControllers.getOne,
);

router.patch(
  '/:id',
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  validateRequest(PaymentValidations.updatePaymentSchema),
  PaymentControllers.updateOne,
);

router.delete('/:id', auth(UserRole.ADMIN), PaymentControllers.deleteOne);

// Payment verification routes
router.post(
  '/verify',
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  validateRequest(PaymentValidations.verifyPaymentSchema),
  PaymentControllers.verifyPayment,
);

// Shurjopay webhook callback route - no auth required, called by Shurjopay
router.post(
  '/webhook',
  validateRequest(PaymentValidations.webhookCallbackSchema),
  PaymentControllers.webhookCallback,
);

export const PaymentRoutes = router;
