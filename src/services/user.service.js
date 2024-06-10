import dotenv from 'dotenv';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env.config.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';


class UserService {
    async registerUser(email, password, role) {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(409).json(createError(ERROR_CODES.USER_EXISTS, 'User already exists', 409));
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                password: hashedPassword,
                role
            });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to register user', 500));
        }
    }

    async loginUser(email, password) {
        try {
            const user = User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' }); 
            res.status(200).json({ token });
            console.log("logged in successfully");
            return token;
        } catch (error) {
            console.error('Error during login:', error);
        }
    }
}



export default new UserService();
