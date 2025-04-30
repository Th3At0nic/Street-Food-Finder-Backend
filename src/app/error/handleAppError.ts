import config from '../config';
import { TGenericErrorResponse } from '../interface/error';
import AppError from './AppError';

const handleAppError = (error: AppError): TGenericErrorResponse => {
  return {
    status: error.statusCode,
    message: error.message,
    stack: config.NODE_ENV === 'development' ? error.stack : null,
    error: [],
  };
};

export default handleAppError;
