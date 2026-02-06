const express = require('express');
const router = express.Router();
const offeringController = require('../controllers/offering.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', offeringController.getAllOfferings);
router.get('/open', offeringController.getOpenOfferings);
router.get('/:id', offeringController.getOfferingById);

// Admin/Faculty routes
router.post('/', protect, authorize('admin', 'superadmin'), offeringController.createOffering);
router.put('/:id', protect, authorize('admin', 'superadmin'), offeringController.updateOffering);
router.delete('/:id', protect, authorize('admin', 'superadmin'), offeringController.deleteOffering);
router.put('/:id/publish-results', protect, authorize('admin', 'superadmin'), offeringController.publishResults);

module.exports = router;
