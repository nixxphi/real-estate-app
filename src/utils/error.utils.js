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

export const createError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};
