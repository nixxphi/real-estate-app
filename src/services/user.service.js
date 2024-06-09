import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token.utils.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

export const registerUser = async (req, res, next) => {
    const { email, password, role } = req.body;
    console.log(1);
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createError(ERROR_CODES.USER_EXISTS, 'User already exists', 409));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            role
        });
        console.log("2");
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(newUser)
        next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to register user', 500));
    }
};

export const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(createError(ERROR_CODES.NOT_FOUND, 'User not found', 404));
        }
        console.log(2);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(createError(ERROR_CODES.INVALID_CREDENTIALS, 'Invalid password', 401));
        }

        const token = generateToken();
        res.status(200).json({ token });
        return token;
    } catch (error) {
        next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to login user', 500));
    }
};
