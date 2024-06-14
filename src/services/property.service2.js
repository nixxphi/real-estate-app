import Property from '../models/property.model.js';
import { createHttpError, ERROR_CODES } from '../utils/error.utils.js';

class PropertyService {
    async create(data) {
        try {
            const property = new Property(data);
            await property.save();
            return property;
        } catch (error) {
            throw createHttpError(ERROR_CODES.INVALID_INPUT, 'Failed to create property');
        }
    }

    async update(propertyId, data) {
        try {
            const property = await Property.findByIdAndUpdate(propertyId, data, { new: true });
            if (!property) {
                throw createHttpError(ERROR_CODES.NOT_FOUND, 'Property not found', 404);
            }
            return property;
        } catch (error) {
            throw createHttpError(ERROR_CODES.INVALID_INPUT, 'Failed to update property');
        }
    }

    async delete(propertyId) {
        try {
            const property = await Property.findByIdAndDelete(propertyId);
            if (!property) {
                throw createHttpError(ERROR_CODES.NOT_FOUND, 'Property not found', 404);
            }
            return property;
        } catch (error) {
            throw createHttpError(ERROR_CODES.INTERNAL_ERROR, 'Failed to delete property');
        }
    }

    async getAll() {
        try {
            console.log(2);
            const data = await Property.find();
            return data;
        } catch (error) {
            throw createHttpError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch properties 2');
        }
    }

    async getById(propertyId) {
        try {
            const property = await Property.findById(propertyId);
            if (!property) {
                throw createHttpError(ERROR_CODES.NOT_FOUND, 'Property not found', 404);
            }
            return property;
        } catch (error) {
            throw createHttpError(ERROR_CODES.NOT_FOUND, 'Property not found', 404);
        }
    }

    async requestPropertyUpdate(propertyId, updateData) {
        try {
            const property = await Property.findById(propertyId);
            if (!property) {
                throw createHttpError(ERROR_CODES.NOT_FOUND, 'Property not found', 404);
            }
            property.pendingUpdates = updateData;
            await property.save();
            return property;
        } catch (error) {
            throw createHttpError(ERROR_CODES.INVALID_INPUT, 'Failed to request property update', 400, { propertyId, updateData });
        }
    }

    async approveChanges(propertyId) {
        try {
            const property = await Property.findById(propertyId);
            if (!property) {
                throw createHttpError(ERROR_CODES.NOT_FOUND, 'Property not found', 404);
            }
            if (!property.pendingUpdates || Object.keys(property.pendingUpdates).length === 0) {
                return { message: 'There are no pending changes right now' };
            }
            property.update(property.pendingUpdates);
            property.pendingUpdates = {};
            await property.save();
            return { message: 'Changes approved successfully' };
        } catch (error) {
            throw createHttpError(ERROR_CODES.INVALID_INPUT, 'Failed to approve changes', 400, { propertyId });
        }
    }

    async search(query) {
        try {
            const page = parseInt(query.page, 10) || 1;
            const perPage = parseInt(query.limit, 10) || 10;

            const filter = { ...query, deleted: query.hasOwnProperty('deleted') ? query.deleted : false };
            delete filter.page;
            delete filter.limit;

            const totalCount = await Property.countDocuments(filter);
            const data = await Property.find(filter)
                .skip((page - 1) * perPage)
                .limit(perPage)
                .sort({ createdAt: -1 })
                .select('-__v -updatedAt -deleted');

            return {
                data,
                currentPage: page,
                totalPages: Math.ceil(totalCount / perPage)
            };
        } catch (error) {
            console.error('Error searching properties:', error);
            throw error;
        }
    }

    async count(filter = {}) {
        try {
            return await Property.countDocuments(filter);
        } catch (error) {
            console.error('Error counting properties:', error);
            throw error;
        }
    }

    async paginate(filter = {}, pageSize = 10, page = 1) {
        try {
            return await Property.find(filter)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .select('-__v -updatedAt -deleted');
        } catch (error) {
            console.error('Error paginating properties:', error);
            throw error;
        }
    }

    async findOneOrCreate(filter, data) {
        try {
            const result = await Property.findOneAndUpdate(filter, data, { upsert: true, new: true });
            return result;
        } catch (error) {
            console.error('Error finding or creating property:', error);
            throw error;
        }
    }
}

export default new PropertyService();
