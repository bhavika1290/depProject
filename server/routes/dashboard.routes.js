const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Admin/Faculty dashboard
router.get('/stats', protect, authorize('admin', 'faculty', 'superadmin'), dashboardController.getDashboardStats);
router.get('/category-wise', protect, authorize('admin', 'superadmin'), dashboardController.getCategoryWiseApplications);
router.get('/gender-wise', protect, authorize('admin', 'superadmin'), dashboardController.getGenderWiseApplications);

// Student dashboard
router.get('/student-stats', protect, dashboardController.getStudentDashboard);

module.exports = router;
