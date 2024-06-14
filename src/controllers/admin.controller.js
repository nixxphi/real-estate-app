import changeRequestsService from '../services/changes.service.js';
import { createHttpError, ERROR_CODES } from '../utils/error.utils.js';

class ChangeRequestsController {
    async getPendingChangeRequests(req, res, next) {
        try {
            const changeRequests = await changeRequestsService.getPendingChangeRequestsService();
            res.json(changeRequests);
        } catch (error) {
            next(createHttpError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch change requests'));
        }
    }

    async approveChangeRequest(req, res, next) {
        try {
            const { id: requestId } = req.params;
            const { action, changes, comment } = req.body;
            const userId = req.user.id;

            if (changes.includes('newAddress')) {
                return next(createHttpError(ERROR_CODES.FORBIDDEN, 'Address changes are not allowed', 403));
            }

            const result = await changeRequestsService.approveChangeRequest(requestId, action, userId, changes, comment);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async bulkApproveChangeRequests(req, res, next) {
        try {
            const { requestIds, action, changes, comment } = req.body;
            const userId = req.user.id;

            if (changes.includes('newAddress')) {
                return next(createHttpError(ERROR_CODES.FORBIDDEN, 'Address changes are not allowed', 403));
            }

            const results = await changeRequestsService.bulkApproveChangeRequests(requestIds, action, userId, changes, comment);
            res.json(results);
        } catch (error) {
            next(error);
        }
    }
}

export default new ChangeRequestsController();
