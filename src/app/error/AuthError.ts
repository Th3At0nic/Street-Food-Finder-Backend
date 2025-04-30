import httpStatus from 'http-status';
import AppError from './AppError';

class AuthError extends AppError {
  constructor(
    public itemName: string,
    public message: string = 'Authentication Error',
  ) {
    super(httpStatus.UNAUTHORIZED, message);
  }
}

export default AuthError;
