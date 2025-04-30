import httpStatus from 'http-status';
import AppError from './AppError';

class NotFoundError extends AppError {
  constructor(
    public itemName: string,
    stack = '',
  ) {
    super(httpStatus.NOT_FOUND, `${itemName} not found!`);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default NotFoundError;
