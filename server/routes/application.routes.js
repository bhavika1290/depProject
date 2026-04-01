const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { protect, authorize, checkProfileCompletion } = require('../middleware/auth.middleware');
const { upload, setUploadType } = require('../utils/upload.util');

// Student routes
router.get('/my-applications', protect, applicationController.getMyApplications);
router.post('/create-order', protect, authorize('student'), applicationController.createOrder);
router.post('/verify-payment', protect, authorize('student'), applicationController.verifyPayment);
router.post(
  '/',
  protect,
  checkProfileCompletion,
  setUploadType('applications'),
  upload.fields([
    { name: 'transactionSlip', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
  ]),
  applicationController.createApplication
);
router.get('/:id', protect, applicationController.getApplicationById);

// Admin/Faculty routes
router.get('/', protect, authorize('admin', 'faculty', 'superadmin'), applicationController.getAllApplications);
router.put('/:id', protect, authorize('admin', 'superadmin'), applicationController.updateApplication);
router.delete('/:id', protect, authorize('admin', 'superadmin'), applicationController.deleteApplication);
router.put('/:id/status', protect, authorize('admin', 'faculty', 'superadmin'), applicationController.updateApplicationStatus);
router.get('/export/:cycleId/:offeringId', protect, authorize('admin', 'faculty', 'superadmin'), applicationController.exportApplications);

module.exports = router;
