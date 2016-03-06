// Date.now ponyfill 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

// Function.prototype.bind ponyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/**
 * @param {Date} targetDate
 * @return {Object.<string, number>}
 */
var Countdowner = function(targetDate) {
  if(!(targetDate instanceof Date)) {
    throw new Error('Only Date object is accepted as a constructor parameter');
  }

  Countdowner.index++;

  this.ID = 'cd' + Countdowner.index.toString();
  this.targetDateMs = targetDate.getTime();
  this.timer = null;
};

// Index counter for Countdowners, also count of existing instances
Countdowner.index = 0;

Countdowner.MS_IN_SEC = 1000;
Countdowner.MS_IN_MIN = Countdowner.MS_IN_SEC * 60;
Countdowner.MS_IN_HOUR = Countdowner.MS_IN_MIN * 60;
Countdowner.MS_IN_DAY = Countdowner.MS_IN_HOUR * 24;

/**
 * @param {number} miliseconds
 */
Countdowner.prototype.decomposeMiliseconds = function(miliseconds) {
  var days, hours, minutes, seconds, rest;

  days = Math.floor(miliseconds / Countdowner.MS_IN_DAY);
  rest = miliseconds % Countdowner.MS_IN_DAY;

  hours = Math.floor(rest / Countdowner.MS_IN_HOUR)
  rest = rest % Countdowner.MS_IN_HOUR;

  minutes = Math.floor(rest / Countdowner.MS_IN_MIN)
  rest = rest % Countdowner.MS_IN_MIN;

  seconds = Math.floor(rest / Countdowner.MS_IN_SEC)

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
};

/**
 * @param {?HTMLElement} placeholder
 */
Countdowner.prototype.create = function(placeholder) {
  if(!placeholder) {
    placeholder = document.createElement('div');
    document.body.appendChild(placeholder);
  }

  // @TODO - if already has id, save it insteaad of create new
  placeholder.id = this.ID;
  this.tick();
};

Countdowner.prototype.tick = function () {
  var message, timeDiff, decomposedMiliseconds;
  
  timeDiff = this.targetDateMs - Date.now();

  if(timeDiff < 0) {
    message = 'Událost již nastala';
    this.timer = null;
  } else {
    message = this.getCountdownMessage(this.decomposeMiliseconds(timeDiff));
    this.timer = setTimeout(this.tick.bind(this), Countdowner.MS_IN_SEC);
  }

  this.display(message);
}

Countdowner.prototype.display = function(text) {
    document.getElementById(this.ID).innerHTML = text;
};

/**
 * @param {Object.<string, number>} remainingTime
 */
Countdowner.prototype.getCountdownMessage = function(remainingTime) {
  return remainingTime.days + ' dnů ' + remainingTime.hours + ' hodin ' +
    remainingTime.minutes + ' minut a ' + remainingTime.seconds + ' vteřin';
};

if(typeof module !== "undefined" && module !== null) {
  module.exports = Countdowner;
}