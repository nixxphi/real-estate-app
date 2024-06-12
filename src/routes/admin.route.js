import { Router } from 'express';
import requestController from '../controllers/admin.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js'; 

const adminRouter = Router();


adminRouter.use(authenticate);
adminRouter.use(authorizeAdmin);


adminRouter.get('/get-changes', requestController.getPendingChangeRequests);
adminRouter.post('/approve-changes', requestController.approveChangeRequest);
adminRouter.post('/bulk-approve-changes', requestController.bulkApproveChangeRequests);

export default adminRouter;
