import Property from '../models/property.model.js';
import GenericService from './generic.service.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

class PropertyService extends GenericService {
    constructor() {
      super(Property); 
    }

    async create(data) {
      try {
        return await super.create(data);
      } catch (error) {
        throw createError(ERROR_CODES.INVALID_INPUT, 'Failed to create property');
      }
    }

    async update(propertyId, data) {
      try {
        return await super.update(propertyId, data);
      } catch (error) {
        throw createError(ERROR_CODES.INVALID_INPUT, 'Failed to update property');
      }
    }

    async delete(propertyId) {
      try {
        return await super.delete(propertyId);
      } catch (error) {
        throw createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to delete property');
      }
    }

    async getAll() {
      try {
        return await super.getAll();
      } catch (error) {
        throw createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch properties');
      }
    }

    async getById(propertyId) {
      try {
        return await super.findById(propertyId);
      } catch (error) {
        throw createError(ERROR_CODES.NOT_FOUND, 'Property not found');
      }
    }

    async requestPropertyUpdate(propertyId, updateData) {
      try {
        const property = await super.findById(propertyId);
        if (!property) {
          throw createError(ERROR_CODES.NOT_FOUND, 'Property not found', 404);
        }
        property.pendingUpdates = updateData;
        await property.save();
        return property;
      } catch (error) {
        throw createError(ERROR_CODES.INVALID_INPUT, 'Failed to request property update', 400, { propertyId, updateData });
      }
    }
  
    async approveChanges(propertyId) {
      try {
        const property = await super.findById(propertyId);
        if (!property) {
          throw createError(ERROR_CODES.NOT_FOUND, 'Property not found', 404);
        }
        if (!property.pendingUpdates || Object.keys(property.pendingUpdates).length === 0) {
          return { message: 'There are no pending changes right now' };
        }
        property.update(property.pendingUpdates);
        property.pendingUpdates = {};
        await property.save();
        return { message: 'Changes approved successfully' };
      } catch (error) {
        throw createError(ERROR_CODES.INVALID_INPUT, 'Failed to approve changes', 400, { propertyId });
      }
    }
}

export default new PropertyService();
