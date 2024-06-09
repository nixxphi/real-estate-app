import { Router } from 'express';
import propertyController from '../controllers/property.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const propertyRouter = Router();

propertyRouter.get('/properties', propertyController.getAllProperties);
propertyRouter.get('/edit-property/:id', authenticate, propertyController.getPropertyById);
propertyRouter.post('/edit-property/:id', authenticate, propertyController.requestPropertyUpdate);
propertyRouter.post('/create-property', authenticate, propertyController.createProperty);
propertyRouter.put('/:id', authenticate, propertyController.updateProperty);
propertyRouter.delete('/:id', authenticate, propertyController.deleteProperty);
propertyRouter.post('/edit-property/:id', authenticate, propertyController.requestPropertyUpdate);


export default propertyRouter;
