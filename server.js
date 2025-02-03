const express = require('express');
const path = require('path');
const cors = require('cors');
const socket = require('socket.io');
const mongoose = require('mongoose');
const helmet = require('helmet');
const Seat = require('./models/seat.model');

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);
io.on('connection', async (socket) => {
  socket.emit('seatsUpdated', await Seat.find({}));
  console.log('New socket! ');
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

const dbUrl =
  process.env.NODE_ENV === 'production'
    ? `mongodb+srv://user1:${process.env.DB_PASS}@clusterticketapp.q90rx.mongodb.net/NewWaveDB`
    : 'mongodb://localhost:27017/NewWaveDBTest';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', (err) => console.log('Error ' + err));

//import router
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');
const workshopRoutes = require('./routes/workshops.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/client/build')));
app.use(helmet());
app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);
app.use('/api', workshopRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: 'not found' });
});

server.prependListener('request', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
});

module.exports = server;
