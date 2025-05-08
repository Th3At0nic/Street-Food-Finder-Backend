import Shurjopay, {
  PaymentRequest,
  PaymentResponse,
  VerificationResponse,
} from 'shurjopay';
import config from '../../config';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { UserDetail, User } from '@prisma/client';

const shurjopay = new Shurjopay();
shurjopay.config(
  config.sp_end_point!,
  config.sp_user_name!,
  config.sp_password!,
  config.sp_prefix!,
  config.sp_return_url!,
);

const makePaymentAsync = async (
  paymentPayload: PaymentRequest,
): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload,
      (response) => resolve(response),
      (error) => {
        reject(error);
      },
    );
  });
};

const verifyPaymentAsync = async (
  userSubscriptionId: string,
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      userSubscriptionId,
      (response) => resolve(response),
      (error) => reject(error),
    );
  });
};

const checkPaymentStatusAsync = async (
  userSubscriptionId: string,
): Promise<VerificationResponse> => {
  return new Promise((resolve, reject) => {
    shurjopay.paymentStatus(
      userSubscriptionId,
      (response) => resolve(response),
      (error) => reject(error),
    );
  });
};

const createPaymentRequest = (
  amount: number,
  userSubscriptionId: string,
  user?: User & { userDetails?: UserDetail | null },
): PaymentRequest => {
  if (!amount || !userSubscriptionId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Amount and user subscription ID are required for payment',
    );
  }

  const paymentRequest: PaymentRequest = {
    amount: amount,
    order_id: userSubscriptionId,
    customer_name: user?.userDetails?.name || 'Customer',
    customer_address: 'Address',
    client_ip: '102.324.0.5',
    customer_phone: user?.userDetails?.contactNumber || '01700000000',
    currency: 'BDT',
    customer_city: 'Dhaka',
    customer_post_code: '1229',
    prefix: '',
    token: '',
    return_url: '',
    cancel_url: '',
    store_id: '',
    customer_email: user?.email ?? '',
  };

  return paymentRequest;
};

// Check if a payment was successful based on Shurjopay verification response
const isPaymentSuccessful = (response: VerificationResponse): boolean => {
  // Common success indicators in Shurjopay
  return (
    response.transaction_status?.toLowerCase() === 'completed' ||
    response.sp_code === 1000 ||
    response.bank_status?.toLowerCase() === 'success'
  );
};

export const paymentUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
  checkPaymentStatusAsync,
  createPaymentRequest,
  isPaymentSuccessful,
};
