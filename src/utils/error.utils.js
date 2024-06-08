// error.utils.js

export const ERROR_CODES = {

    INVALID_INPUT: 'INVALID_INPUT',
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    USER_EXISTS: 'USER_EXISTS',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    PROPERTY_NOT_FOUND: 'PROPERTY_NOT_FOUND',
    PROPERTY_UPDATE_FAILED: 'PROPERTY_UPDATE_FAILED',
    DATABASE_ERROR: 'DATABASE_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
  };
  
  export const createError = (code, message, status = 500) => {
    const error = new Error(message);
    error.code = code;
    error.status = status;
    return error;
  };
  


