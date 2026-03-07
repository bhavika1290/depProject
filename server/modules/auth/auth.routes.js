const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// Mount Auth routes mapped to the controller
router.post('/register', authController.register);
router.post('/register-verify', authController.verifyRegistrationOTP);
router.post('/login', authController.login);
router.post('/login-verify', authController.verifyLoginOTP);

module.exports = router;
