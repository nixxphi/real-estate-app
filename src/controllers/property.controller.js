import {
    getAllPropertiesService,
    getPropertyByIdService,
    createPropertyService,
    updatePropertyService,
    deletePropertyService,
    requestPropertyUpdateService
} from '../services/property.service.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

class PropertyController {
    async getAllProperties(req, res, next) {
        try {
            const properties = await getAllPropertiesService();
            res.render('index', { properties });
        } catch (error) {
            next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch properties'));
        }
    }

    async getPropertyById(req, res, next) {
        try {
            const property = await getPropertyByIdService(req.params.id);
            if (!property) {
                next(createError(ERROR_CODES.NOT_FOUND, 'Property not found'));
                return;
            }
            res.render('edit_property', { property });
        } catch (error) {
            next(error);
        }
    }

    async createProperty(req, res, next) {
        try {
            const property = await createPropertyService(req.body);
            res.status(201).json(property);
        } catch (error) {
            next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to create property'));
        }
    }

    async updateProperty(req, res, next) {
        try {
            const property = await updatePropertyService(req.params.id, req.body);
            if (!property) {
                next(createError(ERROR_CODES.NOT_FOUND, 'Property not found'));
                return;
            }
            res.json(property);
        } catch (error) {
            next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to update property'));
        }
    }

    async deleteProperty(req, res, next) {
        try {
            const property = await deletePropertyService(req.params.id);
            if (!property) {
                next(createError(ERROR_CODES.NOT_FOUND, 'Property not found'));
                return;
            }
            res.json(property);
        } catch (error) {
            next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to delete property'));
        }
    }

    async requestPropertyUpdate(req, res, next) {
        try {
            await requestPropertyUpdateService(req.params.id, req.user.id, req.body);
            res.redirect('/');
        } catch (error) {
            next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to create change request'));
        }
    }
}

export default new PropertyController();

/*
export const getAllProperties = propertyController.getAllProperties.bind(propertyController);
export const getPropertyById = propertyController.getPropertyById.bind(propertyController);
export const createProperty = propertyController.createProperty.bind(propertyController);
export const updateProperty = propertyController.updateProperty.bind(propertyController);
export const deleteProperty = propertyController.deleteProperty.bind(propertyController);
export const requestPropertyUpdate = propertyController.requestPropertyUpdate.bind(propertyController);
*/