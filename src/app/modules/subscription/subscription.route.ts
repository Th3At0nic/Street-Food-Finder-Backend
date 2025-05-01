import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SubscriptionControllers } from './subscription.controller';

import auth from '../../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';
import { createSubscriptionSchema, userSubscribeSchema } from './subscription.vallidation';

const router = express.Router();

// Admin creates a subscription plan
router.post(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(createSubscriptionSchema),
  SubscriptionControllers.createSubscriptionPlan,
);

// User subscribes to a plan
router.post(
  '/subscribe',
  auth(UserRole.USER),
  validateRequest(userSubscribeSchema),
  SubscriptionControllers.subscribeUserToPlan,
);

// Get a user's subscription status
router.get(
  '/status/:userId',
  auth(UserRole.USER),
  SubscriptionControllers.getUserSubscriptionStatus,
);

export const SubscriptionRoutes = router;
