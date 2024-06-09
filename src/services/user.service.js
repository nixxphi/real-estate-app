import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env.config.js';
import bcrypt from 'bcrypt';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

export const registerUser = async ({ email, password }) => {
    const user = await User.create({ email, password });
    return user;
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw createError(ERROR_CODES.UNAUTHORIZED, 'Invalid credentials');
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return token;
};
