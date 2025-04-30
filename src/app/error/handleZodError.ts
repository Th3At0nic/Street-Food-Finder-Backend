import { ZodError, ZodIssue } from 'zod';
import { TGenericErrorResponse } from '../interface/error';
import config from '../config';

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const errorSources = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue?.path.length - 1].toString(),
      message: issue.message,
    };
  });

  return {
    status: 400,
    message: 'Zod Validation Error',
    error: errorSources,
    stack: config.NODE_ENV === 'development' ? error.stack : undefined,
  };
};
export default handleZodError;
