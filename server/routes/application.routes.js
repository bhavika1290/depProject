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

// Admin/Faculty static routes — must come BEFORE /:id to avoid param collision
router.get('/', protect, authorize('admin', 'faculty', 'superadmin'), applicationController.getAllApplications);
router.get('/export-shortlisted', protect, authorize('admin', 'superadmin'), applicationController.exportShortlistedCandidates);
router.get('/export/:cycleId/:offeringId', protect, authorize('admin', 'faculty', 'superadmin'), applicationController.exportApplications);

// Parameterized routes
router.get('/:id', protect, applicationController.getApplicationById);
router.put('/:id', protect, authorize('admin', 'superadmin'), applicationController.updateApplication);
router.delete('/:id', protect, authorize('admin', 'superadmin'), applicationController.deleteApplication);
router.put('/:id/status', protect, authorize('admin', 'faculty', 'superadmin'), applicationController.updateApplicationStatus);

module.exports = router;
