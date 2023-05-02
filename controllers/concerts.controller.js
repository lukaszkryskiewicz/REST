const Concert = require('../models/concert.model');
const Seats = require('../models/seat.model');
const Workshop = require('../models/workshop.model');


exports.getAll = async (req, res) => {
  try {
    const seats = await Seats.find({});
    const workshops = await Workshop.find({}).populate('concertId');
    const concerts = await Concert.find({});
    const seatsTaken = (chosenDay) => seats.filter(seat => seat.day === chosenDay)
    const chosenWorkshop = (chosenDay) => workshops.filter(workshop => workshop.concertId.day === chosenDay);
    const concertsWithFreeSeats = concerts.map((concert) => {
      const freeSeats = 50 - seatsTaken(concert.day).length;
      const workshop = chosenWorkshop(concert.day)
      return { ...concert.toObject(), freeSeats, workshop }
    })
    res.json(concertsWithFreeSeats);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {

  try {
    const con = await Concert.findById(req.params.id);
    if (!con) res.status(404).json({ message: 'Not found' });
    else res.json(con);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }

};

exports.postConcert = async (req, res) => {

  try {

    const { performer, genre, price, day, image } = req.body
    const newConcert = new Concert({ performer: performer, genre: genre, price: price, day: day, image: image });
    await newConcert.save();
    res.json({ message: 'OK' });

  } catch (err) {
    res.status(500).json({ message: err });
  }

};

exports.putConcert = async (req, res) => {
  const { performer, genre, price, day, image } = req.body

  try {
    const con = await Concert.findById(req.params.id);
    if (con) {
      await Concert.updateOne({ _id: req.params.id }, { $set: { performer: performer, genre: genre, price: price, day: day, image: image } });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }

};


exports.deleteConcert = async (req, res) => {

  try {
    const con = await Concert.findById(req.params.id);
    if (con) {
      await Concert.deleteOne({ _id: req.params.id });
      res.json(con);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch (err) {
    res.status(500).json({ message: err });
  }

};

exports.getConcertByPerformer = async (req, res) => {
  try {
    res.json(await Concert.find({ performer: req.params.performer }));
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getConcertByGenre = async (req, res) => {
  try {
    res.json(await Concert.find({ genre: req.params.genre }));
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getConcertByPrice = async (req, res) => {
  try {
    res.json(await Concert.find({ price: { $gt: req.params.price_min, $lt: req.params.price_max } }));
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getConcertByDay = async (req, res) => {
  try {
    res.json(await Concert.find({ day: req.params.day }));
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};