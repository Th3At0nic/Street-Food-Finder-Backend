import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
// to do : import SubscriptionServices from './subscription.service';

const createSubscriptionPlan = catchAsync(async (req, res) => {
    // todo   const result = await SubscriptionServices.createSubscriptionPlan(req.body);
    

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Subscription plan created successfully',
   // todo  data: result,
  });
});

const subscribeUserToPlan = catchAsync(async (req, res) => {
    // todo   const result = await SubscriptionServices.subscribeUserToPlan(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User subscribed to plan successfully',
    // todo data: result,

  });
});

const getUserSubscriptionStatus = catchAsync(async (req, res) => {
 //todo const result = await SubscriptionServices.getUserSubscriptionStatus(req.params.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User subscription status retrieved successfully',
    //todo data: result,
  });
});

export const SubscriptionControllers = {
  createSubscriptionPlan,
  subscribeUserToPlan,
  getUserSubscriptionStatus,
};
