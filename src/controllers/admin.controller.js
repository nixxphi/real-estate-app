import ChangeRequest from '../models/changeRequest.model.js';
import Property from '../models/property.model.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

export const getPendingChangeRequests = async (req, res, next) => {
    try {
        const changeRequests = await ChangeRequest.find({ approved: false }).populate('property user');
        res.render('admin_approve', { changeRequests });
    } catch (error) {
        next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch change requests'));
    }
};

export const approveChangeRequest = async (req, res, next) => {
    try {
        const { requestId, action } = req.body;
        const changeRequest = await ChangeRequest.findById(requestId);

        if (!changeRequest) {
            throw createError(ERROR_CODES.NOT_FOUND, 'Change request not found');
        }

        if (action === 'approve') {
            const property = await Property.findById(changeRequest.propertyId);
            if (changeRequest.newAddress) property.address = changeRequest.newAddress;
            if (changeRequest.newPrice) property.price = changeRequest.newPrice;
            if (changeRequest.newDescription) property.description = changeRequest.newDescription;
            await property.save();
            changeRequest.approved = true;
        } else if (action === 'reject') {
            await changeRequest.delete();
        }

        await changeRequest.save();
        res.redirect('/admin/approve_changes');
    } catch (error) {
        next(error);
    }
};
