import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
import config from '../../config';

const shurjopay = new Shurjopay();
shurjopay.config(
  config.sp_end_point!,
  config.sp_user_name!,
  config.sp_password!,
  config.sp_prefix!,
  config.sp_return_url!,
);

const makePaymentAsync = async (
  paymentPayload: any,
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

  // const paymentResult = await shurjopay.makePayment(paymentPayload,(response)=>{
  //   sendResponse(res,{statusCode:StatusCodes.CREATED,sucess:true,message:"order placed sucessfully",data:response})
  // },(error)=>console.log(error));
  // return paymentResult
};

const verifyPaymentAsync = async (
  order_id: string,
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (response) => resolve(response),
      (error) => reject(error),
    );
  });
};

export const orderUtils = { makePaymentAsync, verifyPaymentAsync };
