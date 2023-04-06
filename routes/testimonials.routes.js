const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// get all testimonials
router.route('/testimonials').get((req, res) => {
  if (db.testimonials.length === 0) {
    res.json({ message: 'There are no testimonials' });
    return;
  }
  res.json(db.testimonials)
});

// get random testimonial
router.route('/testimonials/random').get((req, res) => {
  if (db.testimonials.length === 0) {
    res.json({ message: 'There are no testimonials' });
    return;
  }
  const random = Math.floor(Math.random() * db.testimonials.length)
  res.json(db.testimonials[random])
});

// get testimonial based on id
router.route('/testimonials/:id').get((req, res) => {
  const testimonial = db.testimonials.find(item => item.id.toString() === req.params.id)
  if (!testimonial) {
    res.status(404).json({ message: 'Testimonial not found' });
    return;
  }
  res.json(testimonial)
});

// add testimonial
router.route('/testimonials').post((req, res) => {
  const { author, text } = req.body
  if (author && text) {
    db.testimonials.push({ id: uuidv4(), author, text })
    res.json({ message: 'ok' })
  } else {
    res.json({ message: "Fill all the required information!" })
  }
});

//update testimonial
router.route('/testimonials/:id').put((req, res) => {
  const { author, text } = req.body
  let changedTestimonial = db.testimonials.find(item => item.id.toString() === req.params.id)
  if (!changedTestimonial) {
    res.status(404).json({ message: 'Testimonial not found' });
    return;
  }
  changedTestimonial.author = author,
    changedTestimonial.text = text;
  res.json({ message: 'ok' })
});

// delete testimonial
router.route('/testimonials/:id').delete((req, res) => {
  const idToDelete = db.testimonials.findIndex(item => item.id.toString() === req.params.id)
  if (idToDelete !== -1) {
    db.testimonials.splice(idToDelete, 1)
    res.json({ message: 'ok' })
  } else {
    res.status(404).json({ message: "testimonial not found" })
  }
});

module.exports = router;