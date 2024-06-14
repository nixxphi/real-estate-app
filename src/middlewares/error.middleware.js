import { createHttpError, ERROR_CODES } from '../utils/error.utils.js';

export const notFoundHandler = (req, res) => {
    res.status(ERROR_CODES.NOT_FOUND).json({ error: 'Endpoint not found' });
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
};