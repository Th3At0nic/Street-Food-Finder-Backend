import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SubscriptionServices } from './subscriptionPlan.service';

const createSubscriptionPlan = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.createOneIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Subscription plan created successfully',
    data: result,
  });
});

const getAllSubscriptionPlan = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.getAllFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All subscription plans retrieved successfully',
    data: result,
  });
});

const getSingleSubscriptionPlan = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.getOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription plan retrieved successfully',
    data: result,
  });
});

const deactivateSingleSubscriptionPlan = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.deactivateOneFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription plan deactivated successfully',
    data: result,
  });
});

const updateOneSubscriptionPlan = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.updateOneIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription plan updated successfully',
    data: result,
  });
});

const subscribeUserToPlan = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.subscribeUserToPlan(
    req.params.subscriptionPlanId,
    req.user,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User subscribed to plan successfully',
    data: result,
  });
});

const getUserSubscriptionStatus = catchAsync(async (req, res) => {
  const result = await SubscriptionServices.getUserSubscriptionStatus(
    req.params.userId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User subscription status retrieved successfully',
    data: result,
  });
});

export const SubscriptionControllers = {
  createSubscriptionPlan,
  subscribeUserToPlan,
  getUserSubscriptionStatus,
  getAllSubscriptionPlan,
  getSingleSubscriptionPlan,
  updateOneSubscriptionPlan,
  deactivateSingleSubscriptionPlan,
};
