const express = require('express');
const path = require('path');
const cors = require('cors')
const socket = require('socket.io');
const mongoose = require('mongoose');

const app = express();
app.use((req, res, next) => {
  req.io = io;
  next();
});

const NODE_ENV = process.env.NODE_ENV;
let dbUrl = '';

if (NODE_ENV === 'production') dbUrl = 'url to remote db';
else if (NODE_ENV === 'test') dbUrl = 'mongodb://localhost:27017/NewWaveDBTest';
else dbUrl = 'mongodb+srv://user1:haslouser1@clusterticketapp.yziixc3.mongodb.net/NewWaveDB';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));

//import router
const testimonialsRoutes = require('./routes/testimonials.routes')
const concertsRoutes = require('./routes/concerts.routes')
const seatsRoutes = require('./routes/seats.routes')
const workshopRoutes = require('./routes/workshops.routes')


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/client/build')));
app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);
app.use('/api', workshopRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});


app.use((req, res) => {
  res.status(404).json({ message: 'not found' });
})

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);
io.on('connection', (socket) => {
  console.log('New socket! ')
})

server.prependListener("request", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
});

module.exports = server;