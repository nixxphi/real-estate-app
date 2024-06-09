import { Router } from 'express';
import userRouter from './user.route.js';
import propertyRouter from './property.route.js';
import adminRouter from './admin.route.js';

const mainRouter = Router();

mainRouter.use('/users', userRouter);
mainRouter.use('/properties', propertyRouter);
mainRouter.use('/admin', adminRouter);

export default mainRouter;
