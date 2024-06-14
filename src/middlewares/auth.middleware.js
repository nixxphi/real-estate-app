import User from '../models/user.model.js';
import { createHttpError, ERROR_CODES } from '../utils/error.utils.js';
import jwt from 'jsonwebtoken';
class Authorization {
    async authenticate(req, res, next) {
      const token = req.headers.authorization?.split(' ')[1];
  
      if (!token) {
        console.log(1);
        return next(createHttpError(ERROR_CODES.UNAUTHORIZED, 'No token provided', 401));
        
      }
  
      try {
        const decoded = jwt.decode(token)
        console.log(2);
        req.user = decoded;
        console.log(decoded);
      } catch (error) {
        return next(createHttpError(ERROR_CODES.UNAUTHORIZED, 'Invalid token', 401));
      }
      console.log(1);
      const user = await User.findOne({ _id: req.user._id });
  
      if (!user) {
        return next(createHttpError(ERROR_CODES.UNAUTHORIZED, 'User not found or deleted', 401));
      }
  
      req.user.role = user.role;
  
      next();
    }
  
    async authorizeAdmin(req, res, next) {
      if (req.user.role === 'admin') {
        res.status(200).json({ message: 'Authorised' });
        next();
      } else {
        next(createHttpError(ERROR_CODES.FORBIDDEN, 'You do not have permission to perform this action', 403));
      }
    }
  }
  
  export default new Authorization();