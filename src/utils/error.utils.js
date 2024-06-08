export const ERROR_CODES = {
    INVALID_INPUT: 'INVALID_INPUT',
    NOT_FOUND: 'NOT_FOUND',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
};

export const createError = (code, message) => {
    const error = new Error(message);
    error.code = code;
    return error;
};

