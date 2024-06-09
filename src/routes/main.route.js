import { Router } from 'express';
import userRoutes from './user.route.js';
import propertyRoutes from './property.route.js';
import adminRoutes from './admin.route.js';

const mainRouter = Router();

mainRouter.use('/users', userRoutes);
mainRouter.use('/properties', propertyRoutes);
mainRouter.use('/admin', adminRoutes);

export default mainRouter;
