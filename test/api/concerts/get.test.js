const chai = require('chai');
const chaiHttp = require('chai-http');
const Concert = require('../../../models/concert.model');
const server = require('../../../server.js');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;


describe('GET /api/concerts', () => {
  before(async () => {

    const data = [
      { performer: 'John', genre: 'pop', price: 100, day: 2, image: 'test' },
      { performer: 'Ald', genre: 'rock', price: 50, day: 3, image: 'test' },
      { performer: 'Rob', genre: 'indie', price: 70, day: 1, image: 'test' },
      { performer: 'John', genre: 'metal', price: 90, day: 3, image: 'test' },
      { performer: 'Ald', genre: 'pop', price: 100, day: 2, image: 'test' }
    ]

    for (const dataSet of data) {
      const testConcert = new Concert({ performer: dataSet.performer, genre: dataSet.genre, price: dataSet.price, day: dataSet.day, image: dataSet.price });
      await testConcert.save();
    }
  });

  it('/concerts/should return all concerts with freeTickets parameter', async () => {
    const res = await request(server).get('/api/concerts/');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(5);
    res.body.forEach((concert) => {
      expect(concert).to.have.property('freeSeats');
    });
  });


  it('/concerts/performer/:performer should return selected performer concerts', async () => {
    const res = await request(server).get('/api/concerts/performer/John');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);

  });

  it('/concerts/genre/:genre should return selected genre concerts', async () => {
    const res = await request(server).get('/api/concerts/genre/rock');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);

  });

  it('/concerts/price/:price_min/:price_max should return concert with price between min and max', async () => {
    const res = await request(server).get('/api/concerts/price/70/120');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(3);

  });

  it('/concerts/day/:day should return concerts on selected days', async () => {
    const res = await request(server).get('/api/concerts/day/2');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);

  });

  after(async () => {
    await Concert.deleteMany();
  });

});