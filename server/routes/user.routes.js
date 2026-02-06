const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { upload, setUploadType, setFilterType } = require('../utils/upload.util');

// Profile routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.post(
  '/profile/photo',
  protect,
  setUploadType('profiles'),
  setFilterType('image'),
  upload.single('photo'),
  userController.uploadProfilePhoto
);

// Admin only routes
router.get('/', protect, authorize('admin', 'superadmin'), userController.getAllUsers);
router.post('/', protect, authorize('superadmin'), userController.createUser);
router.put('/:id/role', protect, authorize('superadmin'), userController.updateUserRole);
router.delete('/:id', protect, authorize('superadmin'), userController.deleteUser);

module.exports = router;
