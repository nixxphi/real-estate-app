import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config.js';
import bcrypt from 'bcryptjs';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.create({ email, password });
        res.status(201).json(user);
    } catch (error) {
        next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to register user'));
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw createError(ERROR_CODES.UNAUTHORIZED, 'Invalid credentials');
        }
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        next(error);
    }
};
