import { TGenericErrorResponse } from '../interface/error';
import NotFoundError from './NotFoundError';

const handleNotFoundError = (error: NotFoundError): TGenericErrorResponse => {
  return {
    status: error.statusCode,
    message: error.message,
    error: [],
  };
};

export default handleNotFoundError;
