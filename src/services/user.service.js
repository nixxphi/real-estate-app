import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/env.config.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

class UserService {
  async registerUser(email, password, role) {
    if (!email || !password) {
      throw createError(ERROR_CODES.INVALID_INPUT, 'Email and password are required', 400);
    }

    const validRoles = ['admin', 'client'];
    if (!validRoles.includes(role)) {
      throw createError(ERROR_CODES.INVALID_INPUT, 'Invalid role. Please pick admin or client.', 400);
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw createError(ERROR_CODES.DUPLICATE_ENTRY, 'User already exists', 409);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword, isConfirmed: false, role });
      await user.save();

      return { message: 'User registered successfully', user };
    } catch (error) {
      console.error('Error during user registration:', error);
      throw createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to register user', 500);
    }
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw createError(ERROR_CODES.NOT_FOUND, 'User not found', 404);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw createError(ERROR_CODES.UNAUTHORIZED, 'Invalid credentials', 401);
      }

      const generateToken = (payload) => {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      };

      const token = generateToken({ _id: user._id });
      return { message: 'Login successful', token };
    } catch (error) {
      console.error('Error during login:', error);
      throw createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to login user', 500);
    }
  }
}

export default new UserService();
