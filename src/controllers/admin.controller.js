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

export const approveChangeRequest = async (req, res, next) => {
    try {
        await approveChangeRequestService(req.body.requestId, req.body.action, req.user.id);
        res.redirect('/admin/approve_changes');
    } catch (error) {
        next(error);
    }
};
