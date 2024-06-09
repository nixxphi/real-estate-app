import { Router } from 'express';
import { getPendingChangeRequests, approveChangeRequest } from '../controllers/admin.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const adminRouter = Router();

adminRouter.get('/approve_changes', authenticate, authorizeAdmin, getPendingChangeRequests);
adminRouter.post('/approve_changes', authenticate, authorizeAdmin, approveChangeRequest);

export default adminRouter;
