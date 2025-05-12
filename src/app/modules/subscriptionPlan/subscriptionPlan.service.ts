import {
  SubscriptionPlans,
  PrismaClient,
  SubscriptionStatus,
  PaymentStatus,
  UserRole,
  UserSubscription,
} from '@prisma/client';
import { QueryBuilder } from '../../builder/QueryBuilder';
import { checkIfSubscriptionPlanExist } from '../../utils/checkIfExists';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import NotFoundError from '../../error/NotFoundError';
import config from '../../config';
import { paymentUtils } from '../payment/payment.utils';
import { Decimal, InputJsonValue } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

const createOneIntoDB = async (payload: {
  name: string;
  fee: Decimal;
  description?: string | null;
  features?: InputJsonValue;
  isRecommended?: boolean;
  duration?: number;
}): Promise<SubscriptionPlans> => {
  const result = await prisma.subscriptionPlans.create({
    data: payload,
  });
  return result;
};

const subscribeUserToPlan = async (
  subscriptionPlanId: string,
  userDecoded: JwtPayload,
) => {
  return await prisma.$transaction(async (tx) => {
    const subscriptionPlan = await tx.subscriptionPlans.findUnique({
      where: { spId: subscriptionPlanId, status: SubscriptionStatus.ACTIVE },
    });
    if (!subscriptionPlan) {
      throw new NotFoundError('Subscription plan');
    }

    // Check if user has already subscribed to this plan
    let userSubscription = await tx.userSubscription.findFirst({
      where: {
        userId: userDecoded.id,
        subPlanId: subscriptionPlanId,
        expiringAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          include: {
            userDetails: true,
          },
        },
      },
    });
    if (userSubscription) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You have already subscribed to this plan',
      );
    } else {
      userSubscription = await tx.userSubscription.findFirst({
        where: {
          userId: userDecoded.id,
          subPlanId: subscriptionPlanId,
          expiringAt: null,
        },
        include: {
          user: {
            include: {
              userDetails: true,
            },
          },
        },
      });
      if (!userSubscription) {
        // Create the user subscription within the transaction
        userSubscription = await tx.userSubscription.create({
          data: {
            userId: userDecoded.id,
            subPlanId: subscriptionPlanId,
          },
          include: {
            user: {
              include: {
                userDetails: true,
              },
            },
          },
        });
      }
    }

    try {
      if (userSubscription.user) {
        // Create payment request using the utility function
        const paymentRequest = paymentUtils.createPaymentRequest(
          Number(subscriptionPlan.fee),
          userSubscription.id,
          userSubscription.user,
        );

        // Add return URL and cancel URL
        paymentRequest.return_url = `${config.base_url}/api/payment/return?order_id=${userSubscription.id}`;
        paymentRequest.cancel_url = `${config.base_url}/payment-failure?order_id=${userSubscription.id}`;

        // Make payment request to Shurjopay
        const response = await paymentUtils.makePaymentAsync(paymentRequest);

        if (response.checkout_url) {
          await tx.userSubscription.update({
            where: {
              id: userSubscription.id,
            },
            data: {
              paymentStatus: PaymentStatus.PENDING,
            },
          });
          return response.checkout_url;
        }

        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Failed to process payment',
        );
      }
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Payment processing failed: ' +
          ((error as Error).message || 'Unknown error'),
      );
    }
  });
};

const getAllFromDB = async (query: Record<string, unknown>) => {
  const subscriptionQueryBuilder = new QueryBuilder(
    prisma.subscriptionPlans,
    query,
    ['name'],
  );
  const result = await subscriptionQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();
  return result;
};

const getOneFromDB = async (
  spId: string,
): Promise<SubscriptionPlans | null> => {
  await checkIfSubscriptionPlanExist(spId);
  const result = await prisma.subscriptionPlans.findFirst({
    where: { spId },
  });
  return result;
};

const updateOneIntoDB = async (
  spId: string,
  payload: {
    name?: string;
    fee?: Decimal;
    description?: string | null;
    features?: InputJsonValue;
    isRecommended?: boolean;
    duration?: number;
  },
): Promise<SubscriptionPlans | null> => {
  await checkIfSubscriptionPlanExist(spId);
  const result = await prisma.subscriptionPlans.update({
    where: { spId },
    data: payload,
  });
  return result;
};

const deactivateOneFromDB = async (
  spId: string,
): Promise<SubscriptionPlans | void> => {
  await checkIfSubscriptionPlanExist(spId);
  await prisma.subscriptionPlans.update({
    where: { spId },
    data: { status: SubscriptionStatus.IN_ACTIVE },
  });
};

const getUserSubscriptionStatus = async (
  userId: string,
): Promise<{
  hasActiveSubscription: boolean;
  activeSubscription: UserSubscription | null;
  subscriptionExpiry: Date | null;
  isPremiumUser: boolean;
}> => {
  // Get the user's subscription status
  const activeSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId: userId,
      paymentStatus: PaymentStatus.PAID,
      expiringAt: {
        gt: new Date(),
      },
    },
    include: {
      subscriptionPlan: true,
      payment: true,
      user: {
        select: {
          userDetails: {
            select: {
              name: true,
              profilePhoto: true,
              contactNumber: true,
            },
          },
        },
      },
    },
    orderBy: {
      expiringAt: 'desc',
    },
  });

  // Check if user has premium role
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const isPremiumUser = user?.role === UserRole.PREMIUM_USER;

  return {
    hasActiveSubscription: !!activeSubscription,
    activeSubscription,
    subscriptionExpiry: activeSubscription?.expiringAt || null,
    isPremiumUser,
  };
};

export const SubscriptionServices = {
  subscribeUserToPlan,
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deactivateOneFromDB,
  getUserSubscriptionStatus,
};
