import { Router } from 'express';
import { HomeRoutes } from '../modules/home/home.route';
import { UserRoutes } from '../modules/User/user.route';
import { PostCategoryRoutes } from '../modules/postCategory/postCategory.route';
import { authRoutes } from '../modules/auth/auth.routes';
import { SubscriptionRoutes } from '../modules/subscription/subscription.route';
import { CommentRoutes } from '../modules/comment/comment.route';

const router = Router();

const apiPrefix = '/api';

const moduleRoutes = [
  {
    path: '/',
    route: HomeRoutes,
  },
  {
    path: `${apiPrefix}/auth`,
    route: authRoutes,
  },
  {
    path: `${apiPrefix}/users`,
    route: UserRoutes,
  },
  {
    path: `${apiPrefix}/post-categories`,
    route: PostCategoryRoutes,
  },
  {
    path: `${apiPrefix}/subscription`,
    route: SubscriptionRoutes
  },
  {
    path: `${apiPrefix}/comment`,
    route: CommentRoutes
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

moduleRoutes.forEach((moduleRoute) => {
  router.use(moduleRoute.path, moduleRoute.route);
});

export default router;
