import UserService from '../services/user.service.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

class UserController {
    async register(req, res, next) {
        try {
            const user = await UserService.registerUser(email, password, role);
            res.status(201).json(user);
        } catch (error) {
            console.error('Error during user registration:', error);
            next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to register user', 500));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body; 
            const result = UserService.loginUser(email, password);
            console.log("success")
            res.json({ result });
        } catch (error) {
            console.error('Error during user login:', error);
            next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to login user', 500));
        }
    }
}

export default new UserController();
