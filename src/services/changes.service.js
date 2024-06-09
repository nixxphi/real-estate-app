import ChangeRequest from '../models/changes.model.js';
import Property from '../models/property.model.js';
import User from '../models/user.model.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

export const getPendingChangeRequestsService = async () => {
    return ChangeRequest.find({ approved: false }).populate('property user');
};

export const approveChangeRequestService = async (requestId, action, userId) => {
    const changeRequest = await ChangeRequest.findById(requestId);
    if (!changeRequest) {
        throw createError(ERROR_CODES.NOT_FOUND, 'Change request not found');
    }

    const user = await User.findById(userId);
    if (user.role !== 'admin') {
        throw createError(ERROR_CODES.FORBIDDEN, 'You do not have permission to perform this action');
    }

    if (action === 'approve') {
        const property = await Property.findById(changeRequest.propertyId);
        if (changeRequest.newAddress) property.address = changeRequest.newAddress;
        if (changeRequest.newPrice) property.price = changeRequest.newPrice;
        if (changeRequest.newDescription) property.description = changeRequest.newDescription;
        if (changeRequest.water) property.water = changeRequest.newWater;
        if (changeRequest.power) property.power = changeRequest.newPower;
        if (changeRequest.security) property.security = changeRequest.newSecurity;
        await property.save();
        changeRequest.approved = true;
    } else if (action === 'reject') {
        await changeRequest.delete();
    }

    await changeRequest.save();
    return changeRequest;
};
