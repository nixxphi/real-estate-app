import ChangeRequest from '../models/changes.model.js';
import PropertyService from './property.service.js';
import UserService from './user.service.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

class ChangeRequestsService {
    async getPendingChangeRequestsService() {
        return ChangeRequest.find({ approved: false }).populate('propertyId userId');
    }

    async approveChangeRequest(requestId, action, userId, changes, comment) {
        const changeRequest = await ChangeRequest.findById(requestId);
        if (!changeRequest) {
            throw createError(ERROR_CODES.NOT_FOUND, 'Change request not found');
        }

        const user = await UserService.getById(userId);
        if (!user || user.role !== 'admin') {
            throw createError(ERROR_CODES.FORBIDDEN, 'You do not have permission to perform this action');
        }

        if (action === 'approve') {
            if (changes.newAddress) {
                throw createError(ERROR_CODES.FORBIDDEN, 'Address changes are not allowed');
            }

            const updates = {};
            if (changes.newPrice) updates.price = changes.newPrice;
            if (changes.newDescription) updates.description = changes.newDescription;
            if (changes.newWater !== undefined) updates.water = changes.newWater;
            if (changes.newPower !== undefined) updates.power = changes.newPower;
            if (changes.newSecurity !== undefined) updates.security = changes.newSecurity;

            await PropertyService.update(changeRequest.propertyId, updates);

            changeRequest.approved = true;
        } else if (action === 'reject') {
            changeRequest.comments = comment;
        }

        await changeRequest.save();
        return changeRequest;
    }

    async bulkApproveChangeRequests(requestIds, action, userId, changes, comment) {
        const user = await UserService.getById(userId);
        if (!user || user.role !== 'admin') {
            throw createError(ERROR_CODES.FORBIDDEN, 'You do not have permission to perform this action');
        }

        const results = [];

        for (const requestId of requestIds) {
            const changeRequest = await ChangeRequest.findById(requestId);
            if (!changeRequest) {
                continue;
            }

            if (action === 'approve') {
                if (changes.newAddress) {
                    throw createError(ERROR_CODES.FORBIDDEN, 'Address changes are not allowed');
                }

                const updates = {};
                if (changes.newPrice) updates.price = changes.newPrice;
                if (changes.newDescription) updates.description = changes.newDescription;
                if (changes.newWater !== undefined) updates.water = changes.newWater;
                if (changes.newPower !== undefined) updates.power = changes.newPower;
                if (changes.newSecurity !== undefined) updates.security = changes.newSecurity;

                await PropertyService.update(changeRequest.propertyId, updates);

                changeRequest.approved = true;
            } else if (action === 'reject') {
                changeRequest.comments = comment;
            }

            await changeRequest.save();
            results.push(changeRequest);
        }

        return results;
    }
}

export default new ChangeRequestsService();
