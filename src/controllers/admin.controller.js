import { getPendingChangeRequestsService, approveChangeRequestService } from '../services/changes.service.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

export const getPendingChangeRequests = async (req, res, next) => {
    try {
        const changeRequests = await getPendingChangeRequestsService();
        res.render('admin_approve', { changeRequests });
    } catch (error) {
        next(createError(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch change requests'));
    }
};

export const approveChangeRequest = async (req, res) => {
    try {
      const requestId = req.params.id;
      const action = req.body.action;
      const userId = req.user.id;
      const result = await approveChangeRequestService(requestId, action, userId);
      res.json(result);
    } catch (error) {
        next(error);
    }
};
