import express from 'express';
import { authController } from './auth.controller';

const route = express.Router();
route.post('/login', authController.loginUser);
route.post('/refresh-token', authController.refreshToken);
export const authRoutes = route;
