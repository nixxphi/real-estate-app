import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { createHttpError, ERROR_CODES } from '../utils/error.utils.js';
import tokenService from '../utils/token.utils.js'

class UserService{

  async registerUser(email, password, role) {
    if (!email || !password) {
      throw createHttpError(ERROR_CODES.INVALID_INPUT, 'Email and password are required', 400);
    }

    const validRoles = ["admin", "client"];
    if (!validRoles.includes(role)) {
      throw createHttpError(ERROR_CODES.INVALID_INPUT, 'Invalid role. Please pick admin or client.', 400);
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw createHttpError(ERROR_CODES.DUPLICATE_ENTRY, 'User already exists', 409);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword, isConfirmed: false, role });
      await user.save();

      return { message: 'User registered successfully', user };
    } catch (error) {
      console.error('Error during user registration:', error);
      throw createHttpError(ERROR_CODES.INTERNAL_ERROR, 'Failed to register user', 500);
    }
  }

  async loginUser(email, password) {
    if (!email || !password) {
      throw createHttpError(ERROR_CODES.INVALID_INPUT, 'Email and password are required', 400);
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw createHttpError(ERROR_CODES.NOT_FOUND, 'User not found', 404);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw createHttpError(ERROR_CODES.UNAUTHORIZED, 'Invalid credentials', 401);
      }
      const token = tokenService.generateToken({ _id: user._id });
      return token ;

    } catch (error) {
      console.error('Error during login:', error);
      throw createHttpError(ERROR_CODES.INTERNAL_ERROR, 'Failed to login user', 500);
    }
  }

  async create(data) {
    try {
      const user = new User(data);
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(filter, data) {
    try {
      return await User.findOneAndUpdate(filter, data, { new: true });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(filter) {
    try {
      return await User.findOneAndDelete(filter);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async get(filter) {
    try {
      return await User.findOne(filter);
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async getAll() {
    try {
      return await User.find();
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async search(query) {
    try {
      const page = parseInt(query.page, 10) || 1;
      const perPage = parseInt(query.limit, 10) || 10;

      const filter = { ...query };
      delete filter.page;
      delete filter.limit;

      const totalCount = await User.countDocuments(filter);
      const users = await User.find(filter)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });

      return {
        users,
        currentPage: page,
        totalPages: Math.ceil(totalCount / perPage)
      };
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  async count(filter = {}) {
    try {
      return await User.countDocuments(filter);
    } catch (error) {
      console.error('Error counting users:', error);
      throw error;
    }
  }

  async paginate(filter = {}, pageSize = 10, page = 1) {
    try {
      return await User.find(filter)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error paginating users:', error);
      throw error;
    }
  }

  async findOrCreate(filter, data) {
    try {
      const user = await User.findOneAndUpdate(filter, data, { upsert: true, new: true });
      return user;
    } catch (error) {
      console.error('Error finding or creating user:', error);
      throw error;
    }
  }
}

export default new UserService();
