import propertyService from '../services/property.service2.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

class PropertyController {
  async getAllProperties(req, res, next) {
    try {

      const properties = await propertyService.getAll();
      res.json(properties);
    } catch (error) {
      next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch properties'));
    }
  }
  
  async getPropertyById(req, res, next) {
    try {
      const property = await propertyService.getById(req.params.id);
      if (!property) {
        next(createError(ERROR_CODES.NOT_FOUND, 'Property not found'));
        return;
      }
      res.status(200).json(property);
    } catch (error) {
      next(error);
    }
  }
  
  async createProperty(req, res, next) {
    try {
      const property = await propertyService.create(req.body); 
      res.status(201).json(property);
    } catch (error) {
      next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to create property'));
    }
  }
  
  async updateProperty(req, res, next) {
    try {
      const property = await propertyService.update(req.params.id, req.body); 
      if (!property) {
        throw createError(ERROR_CODES.NOT_FOUND, 'Property not found', 404);
      }
      if (!property.pendingUpdates || Object.keys(property.pendingUpdates).length === 0) {
        return res.status(200).json({ message: 'There are no pending changes right now' });
      }
  
      const changes = property.pendingUpdates;
      return res.status(200).json({ message: 'Pending changes:', changes });
    } catch (error) {
      next(error);
    }
  }
  
  async deleteProperty(req, res, next) {
    try {
      const property = await propertyService.delete(req.params.id); 
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
      await propertyService.requestPropertyUpdate(req.params.id, req.body); 
      res.status(200).json({ message: 'Change request submitted' });
    } catch (error) {
      next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to create change request'));
    }
  }
  
  async searchProperties(req, res, next) {
    try {
      const results = await propertyService.search(req.query); 
      res.json(results);
    } catch (error) {
      next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to search properties'));
    }
  }
  
  async findOneOrCreateProperty(req, res, next) {
    try {
      const property = await propertyService.findOneOrCreate(req.query, req.body); 
      res.json(property);
    } catch (error) {
      next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to find or create property'));
    }
  }
}

export default new PropertyController();
