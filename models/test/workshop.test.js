const Workshop = require('../workshop.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose')

describe('Workshop', () => {

  it('should throw an error if no arg', () => {
    const wrs = new Workshop({});

    wrs.validate(err => {
      expect(err.errors.name).to.exist;
      expect(err.errors.concertId).to.exist;
    });

  });

  it('should throw an error if "name" or "concertId" is not string', () => {

    const cases = [
      { name: {}, concertId: {} },
      { name: [], concertId: [] }];
    for (let item of cases) {
      const wrs = new Workshop({ name: item.name, concertId: item.concertId });

      wrs.validate(err => {
        expect(err.errors.name).to.exist;
        expect(err.errors.concertId).to.exist;
      });
    }
  });




  it('should validate if "name" or "concertId" are strings', () => {

    const cases = [
      { name: 'test', concertId: 'testowy' },
      { name: 'rob', concertId: 'stark' }];
    for (let item of cases) {
      const wrs = new Workshop({ name: item.name, concertId: item.concertId });

      wrs.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });
});