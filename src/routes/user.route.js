import express from 'express';
import UserController from '../controllers/user.controller.js';
import authorize from '../middlewares/auth.middleware.js';
const userRouter = express.Router();

// User Routes
userRouter.post('/register', UserController.register);
userRouter.post('/login', UserController.login);
userRouter.get('/all-users', UserController.getAllUsers);
userRouter.get('/:id', UserController.getUserById);
userRouter.put('/:id', UserController.updateUser);
userRouter.delete('/:id',authorize.authenticate, authorize.authorizeAdmin, UserController.deleteUser);

export default userRouter;
