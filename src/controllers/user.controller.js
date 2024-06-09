import { registerUser, loginUser } from '../services/user.service.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

export const register = async (req, res, next) => {
    try {
        const user = registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to register user'));
    }
};

export const login = async (req, res, next) => {
    try {
        const token = loginUser(req.body);
        res.json({ token });
        
    } catch (error) {
        next(error);
    }
};
