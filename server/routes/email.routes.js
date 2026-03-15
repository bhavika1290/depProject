const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { upload, setUploadType, setFilterType } = require('../utils/upload.util');

// Admin only routes
router.post(
  '/upload-excel',
  protect,
  authorize('admin', 'superadmin'),
  setUploadType('excel'),
  setFilterType('excel'),
  upload.single('file'),
  emailController.uploadExcel
);

router.get('/excel-files', protect, authorize('admin', 'superadmin'), emailController.getExcelFiles);
router.delete('/excel-files/:id', protect, authorize('admin', 'superadmin'), emailController.deleteExcelFile);

router.post('/send-bulk', protect, authorize('admin', 'superadmin'), emailController.sendBulkEmails);
router.post('/resend/:fileId', protect, authorize('admin', 'superadmin'), emailController.resendEmails);

router.get('/logs', protect, authorize('admin', 'superadmin'), emailController.getEmailLogs);

// Custom email sending
router.post('/send-custom', protect, authorize('admin', 'superadmin'), emailController.sendCustomEmails);

module.exports = router;
