import { Router } from 'express';
import propertyController from '../controllers/property.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const propertyRouter = Router();

propertyRouter.get('/', propertyController.getAllProperties);
propertyRouter.get('/find-property/:id', authorize.authenticate, propertyController.getPropertyById);
propertyRouter.post('/request-property-update/:id', authorize.authenticate, propertyController.requestPropertyUpdate);
propertyRouter.post('/create-property', authorize.authenticate, propertyController.createProperty);
propertyRouter.patch('/:id', authorize.authenticate, propertyController.updateProperty);
propertyRouter.delete('/:id', authorize.authenticate, propertyController.deleteProperty);
propertyRouter.get('/search', propertyController.searchProperties);
propertyRouter.post('/find-one-or-create', authorize.authenticate, propertyController.findOneOrCreateProperty);

export default propertyRouter;
