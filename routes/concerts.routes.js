const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// get all concerts
router.route('/concerts').get((req, res) => {
  if (db.concerts.length === 0) {
    res.json({ message: 'There are no concerts' });
    return;
  }
  res.json(db.concerts)
});

// get concert based on id
router.route('/concerts/:id').get((req, res) => {
  const concert = db.concerts.find(item => item.id.toString() === req.params.id)
  if (!concert) {
    res.status(404).json({ message: 'concert not found' });
    return;
  }
  res.json(concert)
});

// add concert
router.route('/concerts').post((req, res) => {
  const { performer, genre, price, day, image } = req.body
  if (performer, genre, price, day, image) {
    db.concerts.push({ id: uuidv4(), performer, genre, price, day, image })
    res.json({ message: 'ok' })
  } else {
    res.json({ message: "Fill all the required information!" })
  }
});

//update concert
router.route('/concerts/:id').put((req, res) => {
  const { performer, genre, price, day, image } = req.body
  let changedConcert = db.concerts.find(item => item.id.toString() === req.params.id)
  if (!changedConcert) {
    res.status(404).json({ message: 'concert not found' });
    return;
  }
  changedConcert = { ...changedConcert, performer, genre, price, day, image }
  res.json({ message: 'ok' })
});

// delete concert
router.route('/concerts/:id').delete((req, res) => {
  const idToDelete = db.concerts.findIndex(item => item.id.toString() === req.params.id)
  if (idToDelete !== -1) {
    db.concerts.splice(idToDelete, 1)
    res.json({ message: 'ok' })
  } else {
    res.status(404).json({ message: "concert not found" })
  }
});

module.exports = router;