import Property from '../models/property.model.js';
import ChangeRequest from '../models/changes.model.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';
import GenericService from './generic.service.js';


const propertyGeneric = new GenericService(Property);

export const getAllPropertiesService = async () => {
    try {
        return await propertyGeneric.getAll();
    } catch (error) {
        throw createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch properties');
    }
};

export const getPropertyByIdService = async (id) => {
    try {
        const property = await propertyGeneric.findById(id);
        if (!property) {
            throw createError(ERROR_CODES.NOT_FOUND, 'Property not found');
        }
        return property;
    } catch (error) {
        throw createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch property');
    }
};

export const createPropertyService = async (propertyData) => {
    try {
        return await propertyGeneric.create(propertyData);
    } catch (error) {
        throw createError(ERROR_CODES.INVALID_INPUT, 'Failed to create property');
    }
};

export const updatePropertyService = async (id, updateData) => {
    try {
        const property = await propertyGeneric.update({ _id: id }, updateData);
        if (!property) {
            throw createError(ERROR_CODES.NOT_FOUND, 'Property not found');
        }
        return property;
    } catch (error) {
        throw createError(ERROR_CODES.INVALID_INPUT, 'Failed to update property');
    }
};

export const deletePropertyService = async (id) => {
    try {
        const property = await propertyGeneric.delete({ _id: id });
        if (!property) {
            throw createError(ERROR_CODES.NOT_FOUND, 'Property not found');
        }
        return property;
    } catch (error) {
        throw createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to delete property');
    }
};

export const requestPropertyUpdateService = async (propertyId, userId, { address, price, description, water, power, security }) => {
    try {
        const changeRequest = await ChangeRequest.create({
            propertyId,
            userId,
            newAddress: address,
            newPrice: price,
            newDescription: description,
            newWater: water,
            newPower: power,
            newSecurity: security
        });
        return changeRequest;
    } catch (error) {
        throw createError(ERROR_CODES.INVALID_INPUT, 'Failed to create change request');
    }
};
