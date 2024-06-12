import UserService from '../services/user.service.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

class UserController {
  async register(req, res, next) {
    try {
      const { email, password, role } = req.body;
      const user = await UserService.registerUser(email, password, role);
      console.log('Successfully registered user');
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      console.error('Error during user registration:', error);
      next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to register user', 500));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const token = await UserService.loginUser(email, password);
      console.log("Login successful");
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during user login:', error);
      next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to login user', 500));
    }
  }

  // Additional CRUD methods using GenericService:

  async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAll(); // Use GenericService.getAll()
      res.json(users);
    } catch (error) {
      console.error('Error fetching all users:', error);
      next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch users', 500));
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id); 
      if (!user) {
        throw createError(ERROR_CODES.NOT_FOUND, 'User not found', 404);
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      next(error); 
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const user = await UserService.update({ _id: id }, updateData); // Use GenericService.update()
      if (!user) {
        throw createError(ERROR_CODES.NOT_FOUND, 'User not found', 404);
      }
      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error('Error updating user:', error);
      next(error); 
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.delete({ _id: id }); // Use GenericService.delete()
      if (!user) {
        throw createError(ERROR_CODES.NOT_FOUND, 'User not found', 404);
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      next(error); 
    }
  }
}

export default new UserController();
