describe('Countdowner', function () {
  var Countdowner, element;

  var createPlaceholderElement = function(id) {
    var pl = document.createElement('div');
    if(id) { pl.id = id; }
    document.body.appendChild(pl);

    return pl;
  }

  before(function () {
    Countdowner = require('../src/countdowner');
  });

  it('should have zero count of countdowners on start', function () {
    expect(Countdowner.index).to.equal(0);
  });

  describe('#constructor', function () {
    beforeEach(function () {
      Countdowner.index = 0;
    });

    it('should throw when date not supplied to constructor', function () {
      expect(function() {
        new Countdowner(new Object())
      }).to.throw('Only Date object is accepted as a constructor parameter');
    });

    it('should not throw when date supplied to constructor', function () {
      expect(function() {
        new Countdowner(new Date())
      }).to.not.throw();
    });

    it('should store miliseconds of date supplied to instance', function () {
      var date = new Date();
      var cd = new Countdowner(date);

      expect(cd.targetDate.getTime()).to.equal(date.getTime());
    });

    it('should increment count of instances', function () {
      new Countdowner(new Date);
      new Countdowner(new Date);

      expect(Countdowner.index).to.equal(2);
    });

    it('should create ID of related element', function() {
      cd1 = new Countdowner(new Date);
      cd2 = new Countdowner(new Date);
      cd3 = new Countdowner(new Date);

      expect(cd1.ID).to.equal('cd1');
      expect(cd2.ID).to.equal('cd2');
      expect(cd3.ID).to.equal('cd3');
    });
  });

  describe('#render', function () {
    beforeEach(function () {
      this.cd = new Countdowner(new Date);
      sinon.stub(this.cd, '_tick');
      sinon.stub(this.cd, '_stylePlaceholder');
    });

    afterEach(function () {
      this.cd._tick.restore();
      this.cd._stylePlaceholder.restore();
      delete this.cd;
      if(element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    it('should create new placeholder if none supplied', function () {
      this.cd.render();

      element = document.getElementById('cd' + Countdowner.index);
      expect(element).to.exist;
    });

    it('should not create new placeholder if supplied', function () {
      element = createPlaceholderElement('new_placeholder1');

      this.cd.render(element);

      expect(document.getElementById('cd' + Countdowner.index)).to.not.exist;
    });

    it('should preserve and keep supplied placeholder id', function () {
      var id = 'new_placeholder2'
      element = createPlaceholderElement(id);

      this.cd.render(element);

      expect(document.getElementById(id)).to.exist;
      expect(this.cd.ID).to.equal(id);
    });

    it('should add generated id to placeholder if it doesnt has it', function () {
      var id = 'cd' + Countdowner.index;
      element = createPlaceholderElement(null);

      this.cd.render(element);

      expect(document.getElementById(id)).to.exist;
      expect(this.cd.ID).to.equal(id);
    });

    it('should style placeholder when styles supplied', function () {
      element = createPlaceholderElement(null);

      this.cd.render(element, {color: 'red'});

      expect(this.cd._stylePlaceholder.callCount).to.equal(1);
      expect(this.cd._stylePlaceholder.args[0][0]).to.exist;
      expect(this.cd._stylePlaceholder.args[0][1]).to.eql({color: 'red'});
    })

    it('should not style placeholder when styles not supplied', function () {
      element = createPlaceholderElement(null);

      expect(this.cd._stylePlaceholder.callCount).to.equal(0);
    })
  });

  describe('#_stylePlaceholder', function () {
    beforeEach(function () {
      this.cd = new Countdowner(new Date);
      element = createPlaceholderElement('testStylePh');
    });

    afterEach(function () {
      delete this.cd;
      if(element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    it('should add supplied styles to element', function () {
      var styles = {color: 'white', opacity: 0.8}

      this.cd._stylePlaceholder(element, styles)

      expect(element.style.color).to.equal(styles.color);
      expect(element.style.opacity).to.equal(styles.opacity.toString());
    });

    it('should be able to set double world style propeperty', function () {
      var styles = {
        'background-color': 'green',
        'font-size': '18px',
        'font-weight': 'bold'
      }

      this.cd._stylePlaceholder(element, styles)

      expect(element.style.backgroundColor).to.equal(styles['background-color']);
      expect(element.style.fontSize).to.equal(styles['font-size']);
      expect(element.style.fontWeight).to.equal(styles['font-weight']);
    });
  });

  describe('#_tick', function () {
    var stubMethods = function(obj) {
      sinon.stub(obj, '_getCountdownMessage');
      sinon.stub(obj, '_decomposeMiliseconds');
      sinon.stub(obj, '_display');
    }

    beforeEach(function () {
      this.targetDate = new Date(1000 * 25);

      this.cd = new Countdowner(this.targetDate);
      stubMethods(this.cd);

      this.clock = sinon.useFakeTimers();
    });

    afterEach(function () {
      this.cd._getCountdownMessage.restore();
      this.cd._decomposeMiliseconds.restore();
      this.cd._display.restore();
      this.clock.restore()   ;
    });

    it('should display "Event passed" message when actual time is greater than target', function () {
      this.clock.tick(1000 * 26);

      this.cd._tick();

      expect(this.cd._display.calledOnce).to.equal(true);
    });

    it('should decompose remaining miliseconds each second', function () {
      var ticks = 18;
      this.clock.tick(this.targetDate.getTime() - (1000 * ticks));

      this.cd._tick();
      this.clock.tick(1000 * ticks);

      expect(this.cd._decomposeMiliseconds.callCount).to.equal(ticks + 1);
      expect(this.cd._decomposeMiliseconds.args[2][0]).to.equal((ticks - 2) * 1000);
      expect(this.cd._decomposeMiliseconds.lastCall.args[0]).to.equal(0)
    });

    it('should fix difference over daylight saving time', function () {
      var diff, targetDate, todayDate;
      targetDate = new Date(2016, 3, 2, 10, 0, 0);
      todayDate = new Date(2016, 2, 6, 22, 0, 0);

      this.cd = new Countdowner(targetDate);
      stubMethods(this.cd);

      this.clock.tick(todayDate.getTime());
      this.cd._tick();

      expect(this.cd._decomposeMiliseconds.callCount).to.equal(1);
      diff = this.cd._decomposeMiliseconds.lastCall.args[0]
      this.cd._decomposeMiliseconds.restore()
      sinon.spy(this.cd, '_decomposeMiliseconds');
      expect(this.cd._decomposeMiliseconds(diff).hours).to.equal(12);
    });

    it('should not fix difference for no daylight saving time', function () {
      var diff, targetDate, todayDate;
      targetDate = new Date(2016, 2, 26, 11, 0, 0);
      todayDate = new Date(2016, 2, 6, 22, 0, 0);

      this.cd = new Countdowner(targetDate);
      stubMethods(this.cd);

      this.clock.tick(todayDate.getTime());
      this.cd._tick();

      expect(this.cd._decomposeMiliseconds.callCount).to.equal(1);
      diff = this.cd._decomposeMiliseconds.lastCall.args[0]
      this.cd._decomposeMiliseconds.restore()
      sinon.spy(this.cd, '_decomposeMiliseconds');
      expect(this.cd._decomposeMiliseconds(diff).hours).to.equal(13);
    });
  });

  describe('#_decomposeMiliseconds', function () {
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
      var decomposed = this.cd._decomposeMiliseconds(ms);

      expect(decomposed.days).to.equal(14);
    });

    it('should extract correct count of hours', function () {
      // 2 days, 22 hours, 52 minutes 50 seconds
      var ms = (1000 * 60 * 60 * 24 * 2) + (1000 * 60 * 60 * 22) +
        (1000 * 60 * 52) + (1000 * 50);
      var decomposed = this.cd._decomposeMiliseconds(ms);

      expect(decomposed.hours).to.equal(22);
    });

    it('should extract correct count of minutes', function () {
      // 18 hours, 31 minutes, 5 seconds
      var ms = (1000 * 60 * 60 * 18) + (1000 * 60 * 31) + (1000 * 5);
      var decomposed = this.cd._decomposeMiliseconds(ms);

      expect(decomposed.minutes).to.equal(31);
    });

    it('should extract correct count of seconds', function () {
      // 3 minutes, 2 seconds
      var ms = (1000 * 60 * 3) + (1000 * 2);
      var decomposed = this.cd._decomposeMiliseconds(ms);

      expect(decomposed.seconds).to.equal(2);
    });
  });

});
