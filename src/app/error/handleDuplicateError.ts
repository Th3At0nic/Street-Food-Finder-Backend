import config from '../config';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (error: Error): TGenericErrorResponse => {
  const match = error?.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];
  const errorSources: TErrorSources = [
    {
      path: '',
      message: `"${extractedMessage}" already exists`,
    },
  ];
  return {
    status: 400,
    message: 'DuplicateError',
    error: errorSources,
    stack: config.NODE_ENV === 'development' ? error.stack : null,
  };
};

export default handleDuplicateError;
