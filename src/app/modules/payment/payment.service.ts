import {
  Payment,
  PaymentStatus,
  PrismaClient,
  UserRole,
  UserSubscription,
} from '@prisma/client';
import { QueryBuilder } from '../../builder/QueryBuilder';
import NotFoundError from '../../error/NotFoundError';
import sp, { VerificationResponse } from 'shurjopay';
import config from '../../config';
import { paymentUtils } from './payment.utils';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const shurjopay = new sp();

shurjopay.config(
  config.sp_end_point as string,
  config.sp_user_name as string,
  config.sp_password as string,
  config.sp_prefix as string,
  config.sp_return_url as string,
);
const prisma = new PrismaClient();

const checkIfPaymentExist = async (pmId: string): Promise<void> => {
  if (
    !(await prisma.payment.count({
      where: { pmId },
    }))
  ) {
    throw new NotFoundError('Payment');
  }
};

const createOneIntoDB = async (payload: Payment): Promise<Payment> => {
  const result = await prisma.payment.create({
    data: payload,
  });
  return result;
};

const getAllFromDB = async (query: Record<string, unknown>) => {
  const postCategoryQueryBuilder = new QueryBuilder(prisma.payment, query, [
    'name',
  ]);
  const result = await postCategoryQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();
  return result;
};

const getOneFromDB = async (pmId: string): Promise<Payment | null> => {
  await checkIfPaymentExist(pmId);
  const result = await prisma.payment.findFirst({
    where: { pmId },
  });
  return result;
};

const updateOneIntoDB = async (
  pmId: string,
  payload: Partial<Payment>,
): Promise<Payment | null> => {
  await checkIfPaymentExist(pmId);
  const result = await prisma.payment.update({
    where: { pmId },
    data: payload,
  });
  return result;
};

const deleteOneFromDB = async (pmId: string): Promise<Payment | void> => {
  await checkIfPaymentExist(pmId);
  await prisma.payment.delete({
    where: { pmId },
  });
};

const verifyPayment = async (
  spOrderId: string,
): Promise<{
  verificationResponse: VerificationResponse[];
  payment: Payment | null;
  userSubscription: UserSubscription | null;
}> => {
  try {
    // Get verification response from shurjopay
    const verificationResponse =
      await paymentUtils.verifyPaymentAsync(spOrderId);

    if (!verificationResponse || verificationResponse.length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to verify payment with Shurjopay',
      );
    }
    const userSubscriptionId = verificationResponse[0].customer_order_id;
    const userSubscription = await prisma.userSubscription.findUnique({
      where: { id: userSubscriptionId },
      include: {
        subscriptionPlan: true,
      },
    });

    if (!userSubscription) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User subscription not found for this payment',
      );
    }

    let payment = null;
    const paymentData = {
      userId: userSubscription.userId,
      paymentId: verificationResponse[0].order_id,
      amount: verificationResponse[0].amount.toString(),
    };

    if (userSubscription.pmId) {
      payment = await prisma.payment.update({
        where: { pmId: userSubscription.pmId },
        data: paymentData,
      });
    } else {
      payment = await prisma.payment.create({
        data: paymentData,
      });

      await prisma.userSubscription.update({
        where: { id: userSubscriptionId },
        data: {
          pmId: payment.pmId,
        },
      });
    }

    return { verificationResponse, payment, userSubscription };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Payment verification failed: ' + (error as Error).message,
    );
  }
};

const handlePaymentSuccess = async (
  userSubscriptionId: string,
  transactionData: VerificationResponse,
): Promise<UserSubscription> => {
  return await prisma.$transaction(async (tx) => {
    // Find the user subscription
    const userSubscription = await tx.userSubscription.findUnique({
      where: { id: userSubscriptionId },
      include: {
        subscriptionPlan: true,
      },
    });

    if (!userSubscription) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User subscription not found for this payment',
      );
    }

    // Create a payment record if it doesn't exist
    let payment;
    if (!userSubscription.pmId) {
      payment = await tx.payment.create({
        data: {
          userId: userSubscription.userId,
          paymentId: transactionData.order_id as string,
          amount: userSubscription.subscriptionPlan.fee.toString(),
        },
      });
    } else {
      payment = await tx.payment.findUnique({
        where: { pmId: userSubscription.pmId },
      });
    }

    if (!payment) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Payment record could not be created or found',
      );
    }

    // Calculate expiration date based on subscription plan duration
    const expirationDate = new Date();
    expirationDate.setDate(
      expirationDate.getDate() + userSubscription.subscriptionPlan.duration,
    );

    // Update user subscription with payment details and expiration date
    const updatedSubscription = await tx.userSubscription.update({
      where: { id: userSubscriptionId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        pmId: payment.pmId,
        expiringAt: expirationDate,
      },
      include: {
        subscriptionPlan: true,
        user: true,
      },
    });

    // Update user role to PREMIUM_USER if payment was successful
    await tx.user.update({
      where: { id: userSubscription.userId },
      data: {
        role: UserRole.PREMIUM_USER,
      },
    });

    return updatedSubscription;
  });
};

export const PaymentServices = {
  createOneIntoDB,
  getAllFromDB,
  getOneFromDB,
  updateOneIntoDB,
  deleteOneFromDB,
  verifyPayment,
  handlePaymentSuccess,
};
