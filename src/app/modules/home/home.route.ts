import { Router } from 'express';
import { HomeController } from './home.conroller';

const router = Router();
router.get('/', HomeController.index);

export const HomeRoutes = router;
