const express = require('express');
const router = express.Router();
const admissionCycleController = require('../controllers/admissionCycle.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', admissionCycleController.getAllCycles);
router.get('/active', admissionCycleController.getActiveCycle);
router.get('/:id', admissionCycleController.getCycleById);

// Admin only routes
router.post('/', protect, authorize('admin', 'superadmin'), admissionCycleController.createCycle);
router.put('/:id', protect, authorize('admin', 'superadmin'), admissionCycleController.updateCycle);
router.delete('/:id', protect, authorize('admin', 'superadmin'), admissionCycleController.deleteCycle);
router.put('/:id/activate', protect, authorize('admin', 'superadmin'), admissionCycleController.activateCycle);

module.exports = router;
