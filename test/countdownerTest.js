var expect = require('expect');
var sinon = require('sinon');

describe('Countdowner', function () {
  var Countdowner;

  before(function () {
    Countdowner = require('../src/countdowner');
  });

  beforeEach(function () {
    Countdowner.index = 0;
  });

  it('should have zero count of countdowners on start', function () {
    expect(Countdowner.index).toEqual(0);
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

    it('should store miliseconds of date supplied to instance', function () {
      var date = new Date();
      var cd = new Countdowner(date);

      expect(cd.targetDateMs).toEqual(date.getTime());
    });

    it('should increment count of instances', function () {
      new Countdowner(new Date);
      new Countdowner(new Date);

      expect(Countdowner.index).toEqual(2);
    });

    it('should create ID of related element', function() {
      cd1 = new Countdowner(new Date);
      cd2 = new Countdowner(new Date);
      cd3 = new Countdowner(new Date);

      expect(cd1.ID).toEqual('cd1');      
      expect(cd2.ID).toEqual('cd2');      
      expect(cd3.ID).toEqual('cd3');      
    });
  });

  describe('#decomposeMiliseconds', function () {
    before(function () {
      this.cd = new Countdowner(new Date);
    });

    after(function () {
      delete this.cd;
    });

    it('should extract correct count of days', function () {
      // 14 days, 18 hours, 28 minutes 2 seconds
      var ms = (1000 * 60 * 60 * 24 * 14) + (1000 * 60 * 60 * 18) +
        (1000 * 60 * 28) + (1000 * 2);
      var decomposed = this.cd.decomposeMiliseconds(ms);

      expect(decomposed.days).toEqual(14);
    });

    it('should extract correct count of hours', function () {
      // 2 days, 22 hours, 52 minutes 50 seconds
      var ms = (1000 * 60 * 60 * 24 * 2) + (1000 * 60 * 60 * 22) +
        (1000 * 60 * 52) + (1000 * 50);
      var decomposed = this.cd.decomposeMiliseconds(ms);

      expect(decomposed.hours).toEqual(22);
    });

    it('should extract correct count of minutes', function () {
      // 18 hours, 31 minutes, 5 seconds
      var ms = (1000 * 60 * 60 * 18) + (1000 * 60 * 31) + (1000 * 5);
      var decomposed = this.cd.decomposeMiliseconds(ms);

      expect(decomposed.minutes).toEqual(31);
    });

    it('should extract correct count of seconds', function () {
      // 3 minutes, 2 seconds
      var ms = (1000 * 60 * 3) + (1000 * 2);
      var decomposed = this.cd.decomposeMiliseconds(ms);

      expect(decomposed.seconds).toEqual(2);
    });
  });

  describe('#tick', function () {
    beforeEach(function () {
      this.targetDate = new Date(1000 * 25);
      this.cd = new Countdowner(this.targetDate); 
      sinon.stub(this.cd, 'getCountdownMessage');
      sinon.stub(this.cd, 'decomposeMiliseconds');
      sinon.stub(this.cd, 'display');
      this.clock = sinon.useFakeTimers();
    });

    afterEach(function () {
      this.cd.getCountdownMessage.restore();
      this.cd.decomposeMiliseconds.restore();      
      this.cd.display.restore();   
      this.clock.restore()   ;
    });

    it('should display "Event passed" message when actual time is greater than target', function () {
      this.clock.tick(1000 * 26);

      this.cd.tick();

      expect(this.cd.display.calledOnce).toEqual(true);
    });

    it('should decompose remaining miliseconds each second', function () {
      var ticks = 18;
      this.clock.tick(this.targetDate.getTime() - (1000 * ticks));
      
      this.cd.tick();
      this.clock.tick(1000 * ticks);
      
      expect(this.cd.decomposeMiliseconds.callCount).toEqual(ticks + 1);
    });
  });

});