import { Router } from 'express';
import propertyController from '../controllers/property.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const propertyRouter = Router();

propertyRouter.get('/', propertyController.getAllProperties);
propertyRouter.get('/edit-property/:id', authenticate, propertyController.getPropertyById);
propertyRouter.post('/request-property-update/:id', propertyController.requestPropertyUpdate);
propertyRouter.post('/create-property', authenticate, propertyController.createProperty);
propertyRouter.patch('/:id', authenticate, propertyController.updateProperty);
propertyRouter.delete('/:id', authenticate, propertyController.deleteProperty);
propertyRouter.get('/search', propertyController.searchProperties);
propertyRouter.post('/find-one-or-create', propertyController.findOneOrCreateProperty);

export default propertyRouter;
