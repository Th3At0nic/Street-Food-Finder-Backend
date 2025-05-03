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

router.get('/', PaymentControllers.getAll);
router.get('/:id', PaymentControllers.getOne);

router.patch(
  '/:id',
  auth(UserRole.USER),
  validateRequest(PaymentValidations.updatePaymentSchema),
  PaymentControllers.updateOne,
);

router.delete('/:id', PaymentControllers.deleteOne);

export const PaymentRoutes = router;
