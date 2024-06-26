import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env.config.js';
import User from '../models/user.model.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';


export const authenticate = (req, res, next) => {
    const tok = req.headers.authorization;
    console.log(tok);
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(createError(ERROR_CODES.UNAUTHORIZED, 'No token provided', 401));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next(createError(ERROR_CODES.UNAUTHORIZED, 'Failed to authenticate token', 401));
    }
};

export const authorizeAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return next(createError(ERROR_CODES.FORBIDDEN, 'You do not have permission to perform this action', 403));
        }
        next();
    } catch (error) {
        next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to verify user role', 500));
    }
};
