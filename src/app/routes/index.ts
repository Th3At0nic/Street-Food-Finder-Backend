import { Router } from 'express';
import { HomeRoutes } from '../modules/home/home.route';
import { UserRoutes } from '../modules/User/user.route';
import { authRoutes } from '../modules/auth/auth.routes';

const router = Router();

const apiPrefix = '/api';

const moduleRoutes = [
  {
    path: '/',
    route: HomeRoutes,
  },
  {
    path: `${apiPrefix}/users`,
    route: UserRoutes,
  },
  {
    path: `${apiPrefix}/auth`,
    route: authRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

moduleRoutes.forEach((moduleRoute) => {
  router.use(moduleRoute.path, moduleRoute.route);
});

export default router;
