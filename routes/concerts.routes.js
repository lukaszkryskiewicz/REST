const express = require('express');
const router = express.Router();
const ConcertController = require('../controllers/concerts.controller');

router.get('/concerts', ConcertController.getAll);
router.get('/concerts/:id', ConcertController.getById);
router.post('/concerts', ConcertController.postConcert);
router.put('/concerts/:id', ConcertController.putConcert);
router.delete('/concerts/:id', ConcertController.deleteConcert);

module.exports = router;