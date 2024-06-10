import UserService from '../services/user.service.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

class UserController {
  async register(req, res, next) {
    try {
      const { email, password, role } = req.body;
      const user = await UserService.registerUser(email, password, role);
      console.log('Successfully signed up');
      
      const initLogin = await UserService.loginUser(email, password);
      console.log("Login successful");
      
      res.status(201).json({ user, initLogin });
    } catch (error) {
      console.error('Error during user registration:', error);
      next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to register user', 500));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.loginUser(email, password);
      console.log("Login successful");
      res.json({ result });
    } catch (error) {
      console.error('Error during user login:', error);
      next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to login user', 500));
    }
  }
}

export default new UserController();
