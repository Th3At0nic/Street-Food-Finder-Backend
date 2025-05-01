import express from 'express';
import { authController } from './auth.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/authMiddleware';

const route = express.Router();
route.post('/login', authController.loginUser);
route.post('/refresh-token', authController.refreshToken);
route.post(
  '/change-password',
  auth(UserRole.ADMIN, UserRole.PREMIUM_USER, UserRole.USER),
  authController.changePassword,
);
route.post('/forgot-password', authController.forgotPassword);
route.post('/reset-password', authController.resetPassword);
export const authRoutes = route;
