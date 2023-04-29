const Seat = require('../models/seat.model');


exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find({}));
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {

  try {
    const sea = await Seat.findById(req.params.id);
    if (!sea) res.status(404).json({ message: 'Not found' });
    else res.json(sea);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }

};

exports.postSeat = async (req, res) => {
  const { day, seat, client, email } = req.body
  if (day && seat && client && email) {
    try {
      const checkedSeat = await Seat.findOne({ $and: [{ day: parseInt(day) }, { seat: parseInt(seat) }] });
      if (checkedSeat) {
        res.status(400).json({ message: 'The slot is already taken...' });
      } else {
        const newSeat = new Seat({ day: parseInt(day), seat: parseInt(seat), client: client, email: email });
        await newSeat.save();
        req.io.emit('seatsUpdated', await Seat.find({}))
        res.json({ message: 'OK' });
      }
    }
    catch (err) {
      res.status(500).json({ message: err });
    }

  } else {
    res.json({ message: 'Fill all the required information!' });
  }
};

exports.putSeat = async (req, res) => {
  const { day, seat, client, email } = req.body

  try {
    const sea = await Seat.findById(req.params.id);
    if (sea) {
      const checkedSeat = await Seat.findOne({ $and: [{ day: parseInt(day) }, { seat: parseInt(seat) }] });
      if (checkedSeat) {
        res.status(400).json({ message: 'The slot is already taken...' });
      } else {
        await Seat.updateOne({ _id: req.params.id }, { $set: { day: day, seat: seat, client: client, email: email } });
        res.json({ message: 'OK' });
      }
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }

};


exports.deleteSeat = async (req, res) => {

  try {
    const sea = await Seat.findById(req.params.id);
    if (sea) {
      await Seat.deleteOne({ _id: req.params.id });
      res.json(sea);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }

};