const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Admin/Faculty routes
router.get('/', protect, authorize('admin', 'faculty', 'superadmin'), templateController.getAllTemplates);
router.get('/:id', protect, authorize('admin', 'faculty', 'superadmin'), templateController.getTemplateById);
router.post('/', protect, authorize('admin', 'superadmin'), templateController.createTemplate);
router.put('/:id', protect, authorize('admin', 'superadmin'), templateController.updateTemplate);
router.delete('/:id', protect, authorize('admin', 'superadmin'), templateController.deleteTemplate);

module.exports = router;
