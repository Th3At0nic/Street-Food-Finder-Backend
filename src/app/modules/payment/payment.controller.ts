import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';
import { paymentUtils } from './payment.utils';
import AppError from '../../error/AppError';

const createOne = catchAsync(async (req, res) => {
  const result = await PaymentServices.createOneIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await PaymentServices.getAllFromDB(req.query, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully',
    data: result,
  });
});

const getOne = catchAsync(async (req, res) => {
  const result = await PaymentServices.getOneFromDB(req.params.id, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment retrieved successfully',
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const result = await PaymentServices.updateOneIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment updated successfully',
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  const result = await PaymentServices.deleteOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment deleted successfully',
    data: result,
  });
});

// Verify payment - manually check a payment status
const verifyPayment = catchAsync(async (req, res) => {
  const { spOrderId } = req.body;
  const result = await PaymentServices.verifyPayment(spOrderId, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment verification completed',
    data: result,
  });
});

// Handle webhook callback from Shurjopay
const webhookCallback = catchAsync(async (req, res) => {
  const { order_id: userSubscriptionId } = req.body;

  if (!userSubscriptionId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User subscription ID is required',
    );
  }

  try {
    const verificationResponse =
      await paymentUtils.verifyPaymentAsync(userSubscriptionId);

    if (!verificationResponse || verificationResponse.length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to verify payment with Shurjopay',
      );
    }
    if (paymentUtils.isPaymentSuccessful(verificationResponse[0])) {
      const result = await PaymentServices.handlePaymentSuccess(
        userSubscriptionId,
        verificationResponse[0],
      );

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment processed successfully',
        data: result,
      });
    } else {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: false,
        message: 'Payment verification failed',
        data: verificationResponse,
      });
    }
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: 'Payment webhook processing error',
      data: { error: (error as Error).message },
    });
  }
});

export const PaymentControllers = {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  verifyPayment,
  webhookCallback,
};
