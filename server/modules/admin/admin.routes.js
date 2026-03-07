const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');

router.get('/dashboard/stats', adminController.getStats);

module.exports = router;
