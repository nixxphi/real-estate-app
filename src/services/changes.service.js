import ChangeRequest from '../models/changes.model.js';
import PropertyService from './property.service2.js';
import Authorization from '../middlewares/auth.middleware.js';
import { createHttpError, ERROR_CODES } from '../utils/error.utils.js';
import tokenService from '../utils/token.utils.js';

class ChangeRequestsService {
    async getPendingChangeRequestsService(token) {
        await Authorization.authenticate(token);
        return ChangeRequest.find({ approved: false }).populate('updates');
    }

    async approveChangeRequest(token, requestId, action, changes, comment) {
        const userId = tokenService.getUserIdFromToken(token);
        await Authorization.authorizeAdmin(token);
        return await this._approveChangeRequest(requestId, action, userId, changes, comment);
    }

    async bulkApproveChangeRequests(token, requestIds, action, changes, comment) {
        const userId = tokenService.getUserIdFromToken(token)
        await Authorization.authorizeAdmin(token);
        return await this._bulkApproveChangeRequests(requestIds, action, userId, changes, comment);
    }

    async _approveChangeRequest(requestId, action, changes, comment) {
        const changeRequest = await ChangeRequest.findById(requestId);
        if (!changeRequest) {
            throw createHttpError(ERROR_CODES.NOT_FOUND, 'Change request not found');
        }

        if (action === 'approve') {
            if (changes.newAddress) {
                throw createHttpError(ERROR_CODES.FORBIDDEN, 'Address changes are not allowed');
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

    async _bulkApproveChangeRequests(requestIds, action, userId, changes, comment) {
        const results = [];

        for (const requestId of requestIds) {
            const changeRequest = await ChangeRequest.findById(requestId);
            if (!changeRequest) {
                continue;
            }

            if (action === 'approve') {
                if (changes.newAddress) {
                    throw createHttpError(ERROR_CODES.FORBIDDEN, 'Address changes are not allowed');
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