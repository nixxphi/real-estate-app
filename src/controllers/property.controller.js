import PropertyService from '../services/property.service.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

class PropertyController {
  constructor() {
    this.propertyService = PropertyService;
  }

  async getAllProperties(req, res, next) {
    try {
      const properties = await this.propertyService.getAll();
      return res.render('index', { properties });
    } catch (error) {
      next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch properties'));
    }
  }
  
  async getPropertyById(req, res, next) {
    try {
      const property = await this.propertyService.getById(req.params.id);
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
      const property = await this.propertyService.create(req.body); 
      res.status(201).json(property);
    } catch (error) {
      next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to create property'));
    }
  }
  
  async updateProperty(req, res, next) {
    try {
      const property = await this.propertyService.getById(req.params.id); 
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
      const property = await this.propertyService.delete(req.params.id); 
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
      await this.propertyService.requestPropertyUpdate(req.params.id, req.user.id, req.body); 
      res.status(200).json({ message: 'Change request submitted' });
    } catch (error) {
      next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to create change request'));
    }
  }
  
  async searchProperties(req, res, next) {
    try {
      const results = await this.propertyService.search(req.query); 
      res.json(results);
    } catch (error) {
      next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to search properties'));
    }
  }
  
  async findOneOrCreateProperty(req, res, next) {
    try {
      const property = await this.propertyService.findOneOrCreate(req.query, req.body); 
      res.json(property);
    } catch (error) {
      next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to find or create property'));
    }
  }
  
}

export default new PropertyController();