import express from 'express';
import { userController } from './user.controller';

const route = express.Router();

route.post('/', userController.insertUserIntoDB); // cloudinery work

export const UserRoutes = route;
