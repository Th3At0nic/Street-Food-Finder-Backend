import { Response } from 'express';
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
};

const sendResponse = <T>(res: Response, responseData: TResponse<T>) => {
  const { statusCode, message, data, success } = responseData;
  const response: Partial<TResponse<T>> = { statusCode, message, success };
  if (data && Object.keys(data).length > 0) {
    response.data = data;
  }
  res.status(statusCode).json(response);
};

export default sendResponse;
