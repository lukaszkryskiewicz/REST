const Workshop = require('../workshop.model');
const Concert = require('../concert.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Workshop', () => {

  before(async () => {

    try {
      await mongoose.connect('mongodb://localhost:27017/NewWaveDBTest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const workshop = new Workshop({ name: 'Test1FN', concertId: 'Test1CI' });
      await workshop.save();

      const workshopTwo = new Workshop({ name: 'Test2FN', concertId: 'Test2CI' });
      await workshopTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const workshops = await Workshop.find();
      const expectedLength = 2;
      expect(workshops.length).to.be.equal(expectedLength);

    });

    it('should return a proper document by various params with "findOne" method', async () => {
      const workshopName = await Workshop.findOne({ name: 'Test1FN' });
      const expectedName = 'Test1FN';
      const workshopConcertId = await Workshop.findOne({ concertId: 'Test2CI' });
      const expectedConcertId = 'Test2CI';
      expect(workshopName.name).to.be.equal(expectedName);
      expect(workshopConcertId.concertId).to.be.equal(expectedConcertId);
    });

    it('should return proper department data with "find" method using populate(\'department\')', async () => {
      const testConcertOne = new Concert({ performer: 'testowy', genre: 'rock', price: 25, day: 1, image: 'image' });
      await testConcertOne.save();
      const testConcert = await Concert.findOne({ performer: 'testowy' })

      const testWorkshop = new Workshop({ name: 'Test3FN', concertId: testConcert.id });
      await testWorkshop.save();

      const workshop = await Workshop.findOne({ name: 'Test3FN' }).populate('concert')

      expect(workshop.concertId.name).to.be.equal(testConcert.name);
    });

    after(async () => {
      await Concert.deleteMany();
      await Workshop.deleteMany();
    });

  });

});