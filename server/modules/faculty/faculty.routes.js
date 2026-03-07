const express = require('express');
const router = express.Router();
const facultyController = require('./faculty.controller');

router.get('/openings', facultyController.getOpenings);

module.exports = router;
