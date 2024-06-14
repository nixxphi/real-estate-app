import pkg from 'http-errors';
import statuses from 'statuses';
const { STATUS_CODES } = statuses;

export const ERROR_CODES = {
  INVALID_INPUT: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  USER_EXISTS: 409,
  INVALID_CREDENTIALS: 401,
  PROPERTY_NOT_FOUND: 404,
  PROPERTY_UPDATE_FAILED: 500,
  DATABASE_ERROR: 500,
  VALIDATION_ERROR: 400,
};

export const getStatusCode = (errorCode) => {
  return ERROR_CODES[errorCode];
};

export const getStatusName = (statusCode) => {
    if (statusCode === undefined || statusCode === null) {
      return 'Unknown Status Code';
    }
    return STATUS_CODES[statusCode];
  };

  export const createHttpError = (errorCode, message) => {
    if (!ERROR_CODES[errorCode]) {
      throw new Error(`Invalid error code: ${errorCode}`);
    }
    const statusCode = getStatusCode(errorCode);
    const statusName = getStatusName(statusCode);
    const error = pkg.HttpError(statusCode, message);
    error.statusName = statusName;
    error.errorCode = errorCode;
    return error;
  };