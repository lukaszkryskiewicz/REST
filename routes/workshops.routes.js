const express = require('express');
const router = express.Router();
const WorkshopController = require('../controllers/workshops.controller');

router.get('/workshops', WorkshopController.getAll);

module.exports = router;