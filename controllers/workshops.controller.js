const Workshop = require('../models/workshop.model');


exports.getAll = async (req, res) => {
  try {
    const workshops = await Workshop.find({}).populate('concertId');
    res.json(workshops);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};