import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SubscriptionControllers } from './subscriptionPlan.controller';

import auth from '../../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';
import {
  updateSubscriptionSchema,
  createSubscriptionSchema,
} from './subscriptionPlan.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(createSubscriptionSchema),
  SubscriptionControllers.createSubscriptionPlan,
);

router.get('/', SubscriptionControllers.getAllSubscriptionPlan);
router.get('/:id', SubscriptionControllers.getSingleSubscriptionPlan);

router.delete(
  '/:id/deactivate',
  auth(UserRole.ADMIN),
  SubscriptionControllers.deactivateSingleSubscriptionPlan,
);

// Admin updates a subscription plan
router.patch(
  '/:id',
  auth(UserRole.ADMIN),
  validateRequest(updateSubscriptionSchema),
  SubscriptionControllers.updateOneSubscriptionPlan,
);

// User subscribes to a plan
router.post(
  '/subscribe/:subscriptionPlanId',
  auth(UserRole.USER),
  SubscriptionControllers.subscribeUserToPlan,
);

// Get a user's subscription status
router.get(
  '/status/:userId',
  auth(UserRole.USER),
  SubscriptionControllers.getUserSubscriptionStatus,
);

export const SubscriptionRoutes = router;
