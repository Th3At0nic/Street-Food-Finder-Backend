import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { VoteControllers } from './vote.controller';
import { VoteValidations } from './vote.validation';
import auth from '../../middlewares/authMiddleware';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  validateRequest(VoteValidations.createVoteSchema),
  VoteControllers.createOne,
);

router.get('/:postId', VoteControllers.getAll);

router.get(
  '/user/:postId',
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  VoteControllers.getUserVote,
);
router.get('/vote-count/:postId', VoteControllers.getVoteCounts);

router.patch(
  '/:postId',
  auth(UserRole.USER, UserRole.PREMIUM_USER),
  validateRequest(VoteValidations.updateVoteSchema),
  VoteControllers.updateOne,
);

router.delete('/:id', auth(UserRole.ADMIN), VoteControllers.deleteOne);

export const VotingRoutes = router;
