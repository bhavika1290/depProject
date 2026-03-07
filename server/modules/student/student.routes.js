const express = require('express');
const router = express.Router();
const studentController = require('./student.controller');

router.get('/profile', studentController.getProfile);

module.exports = router;
