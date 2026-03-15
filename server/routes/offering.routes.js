const express = require('express');
const router = express.Router();
const offeringController = require('../controllers/offering.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', offeringController.getAllOfferings);
router.get('/open', offeringController.getOpenOfferings);
router.get('/:id', offeringController.getOfferingById);

// Admin/Faculty routes
router.post('/', protect, authorize('admin', 'superadmin', 'faculty'), offeringController.createOffering);
router.put('/:id', protect, authorize('admin', 'superadmin', 'faculty'), offeringController.updateOffering);
router.delete('/:id', protect, authorize('admin', 'superadmin', 'faculty'), offeringController.deleteOffering);
router.put('/:id/publish-results', protect, authorize('admin', 'superadmin', 'faculty'), offeringController.publishResults);

module.exports = router;
