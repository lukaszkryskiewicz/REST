const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// get all seats
router.route('/seats').get((req, res) => {
  if (db.seats.length === 0) {
    res.json({ message: 'There are no seats' });
    return;
  }
  res.json(db.seats)
});

// get seat based on id
router.route('/seats/:id').get((req, res) => {
  const seat = db.seats.find(item => item.id.toString() === req.params.id)
  if (!seat) {
    res.status(404).json({ message: 'seat not found' });
    return;
  }
  res.json(seat)
});

// add seat
router.route('/seats').post((req, res) => {
  const { day, seat, client, email } = req.body
  if (day, seat, client, email) {
    const selectedDay = db.seats.filter(item => item.day === parseInt(day))
    if (selectedDay.find(item => item.seat === parseInt(seat))) {
      res.status(400).json({ message: 'The slot is already taken...' })
    } else {
      db.seats.push({ id: uuidv4(), day: parseInt(day), seat: parseInt(seat), client, email })
      req.io.emit('seatsUpdated', db.seats)
      res.json({ message: 'ok' })
    }
  } else {
    res.json({ message: "Fill all the required information!" })
  }
});

//update seat
router.route('/seats/:id').put((req, res) => {
  const { day, seat, client, email } = req.body
  let changedSeat = db.seats.find(item => item.id.toString() === req.params.id)
  if (!changedSeat) {
    res.status(404).json({ message: 'seat not found' });
    return;
  }
  changedSeat = { ...changedSeat, day, seat, client, email }
  res.json({ message: 'ok' })
});

// delete seat
router.route('/seats/:id').delete((req, res) => {
  const idToDelete = db.seats.findIndex(item => item.id.toString() === req.params.id)
  if (idToDelete !== -1) {
    db.seats.splice(idToDelete, 1)
    res.json({ message: 'ok' })
  } else {
    res.status(404).json({ message: "seat not found" })
  }
});

module.exports = router;