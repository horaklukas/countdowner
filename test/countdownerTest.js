var expect = require('expect');
var sinon = require('sinon');

describe('Countdowner', function () {
  var Countdowner;

  before(function () {
    Countdowner = require('../src/countdowner');
  });

  describe('#constructor', function () {
    it('should throw when date not supplied to constructor', function () {
      expect(function() {
        new Countdowner(new Object())
      }).toThrow('Only Date object is accepted as a constructor parameter');
    });

    it('should not throw when date supplied to constructor', function () {
      expect(function() {
        new Countdowner(new Date())
      }).toNotThrow();
    });

    it('should store passed date at instance', function () {
      var date = new Date();
      var cd = new Countdowner(date);

      expect(cd.targetDate.getTime()).toEqual(date.getTime());
    })
  });

  describe('#decomposeMiliseconds', function () {
    it('should extract correct count of days', function () {
      var ms = (1000 * 60 * 60 * 24 * 14);
      var decomposed = Countdowner.decomposeMiliseconds(ms);

      expect(decomposed.days).toEqual(14);
    });

    it('should extract correct count of hours', function () {
      // 2days, 22 hours, 52 minutes 50 seconds
      var ms = (1000 * 60 * 60 * 24 * 2) + (1000 * 60 * 60 * 22) +
        (1000 * 60 * 52) + (1000 * 50);
      var decomposed = Countdowner.decomposeMiliseconds(ms);

      expect(decomposed.hours).toEqual(22);
    });

    it('should extract correct count of minutes', function () {
      // 18 hours, 31 minutes, 5 seconds
      var ms = (1000 * 60 * 60 * 18) + (1000 * 60 * 31) + (1000 * 5);
      var decomposed = Countdowner.decomposeMiliseconds(ms);

      expect(decomposed.minutes).toEqual(31);
    });

    it('should extract correct count of seconds', function () {
      // 3 minutes, 2 seconds
      var ms = (1000 * 60 * 3) + (1000 * 2);
      var decomposed = Countdowner.decomposeMiliseconds(ms);

      expect(decomposed.seconds).toEqual(2);
    });
  });

});