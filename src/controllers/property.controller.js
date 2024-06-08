import Property from '../models/property.model.js';
import ChangeRequest from '../models/changeRequest.model.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

export const getAllProperties = async (req, res, next) => {
    try {
        const properties = await Property.find();
        res.render('index', { properties });
    } catch (error) {
        next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch properties'));
    }
};

export const getPropertyById = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            throw createError(ERROR_CODES.NOT_FOUND, 'Property not found');
        }
        res.render('edit_property', { property });
    } catch (error) {
        next(error);
    }
};

export const requestPropertyUpdate = async (req, res, next) => {
    try {
        const { address, price, description } = req.body;
        await ChangeRequest.create({
            propertyId: req.params.id,
            userId: req.user.id,
            newAddress: address,
            newPrice: price,
            newDescription: description,
        });
        res.redirect('/');
    } catch (error) {
        next(createError(ERROR_CODES.INVALID_INPUT, 'Failed to create change request'));
    }
};
