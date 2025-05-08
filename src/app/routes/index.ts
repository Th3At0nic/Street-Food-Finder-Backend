import { Router } from 'express';
import { HomeRoutes } from '../modules/home/home.route';
import { UserRoutes } from '../modules/user/user.route';
import { PostCategoryRoutes } from '../modules/postCategory/postCategory.route';
import { authRoutes } from '../modules/auth/auth.routes';
import { SubscriptionRoutes } from '../modules/subscriptionPlan/subscriptionPlan.route';
import { CommentRoutes } from '../modules/comment/comment.route';
import { PostRoutes } from '../modules/post/post.route';
import { PostRatingRoutes } from '../modules/postRating/postRating.route';
import { VotingRoutes } from '../modules/vote/vote.route';
import { PaymentRoutes } from '../modules/payment/payment.route';

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
    path: `${apiPrefix}/posts`,
    route: PostRoutes,
  },
  {
    path: `${apiPrefix}/subscription-plans`,
    route: SubscriptionRoutes,
  },
  {
    path: `${apiPrefix}/comments`,
    route: CommentRoutes,
  },
  {
    path: `${apiPrefix}/post-ratings`,
    route: PostRatingRoutes,
  },
  {
    path: `${apiPrefix}/votes`,
    route: VotingRoutes,
  },
  {
    path: `${apiPrefix}/payment`,
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

moduleRoutes.forEach((moduleRoute) => {
  router.use(moduleRoute.path, moduleRoute.route);
});

export default router;
