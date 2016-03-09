if(typeof require !== "undefined" && require !== null) {
  Function.prototype.bind = require('function-bind')
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
  this.targetDate = targetDate;
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
Countdowner.prototype._decomposeMiliseconds = function(miliseconds) {
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
Countdowner.prototype.render = function(placeholder) {
  if(!placeholder) {
    placeholder = document.createElement('div');
    document.body.appendChild(placeholder);
  }

  if(placeholder.id) {
    this.ID = placeholder.id;
  } else {
    placeholder.id = this.ID;
  }

  this._tick();
};

Countdowner.prototype._tick = function () {
  var now, utcNowMs, utcTargetDateMs, timeDiff, message, td;

  now = new Date;
  utcNowMs = Date.UTC(now.getFullYear(), now.getMonth() + 1, now.getDate(),
    now.getHours(), now.getMinutes(), now.getSeconds());

  td = this.targetDate;
  utcTargetDateMs = Date.UTC(td.getFullYear(), td.getMonth() + 1, td.getDate(),
    td.getHours(), td.getMinutes(), td.getSeconds()) ;

  timeDiff = utcTargetDateMs - utcNowMs

  if(timeDiff < 0) {
    message = 'Událost již nastala';
    this.timer = null;
  } else {
    message = this._getCountdownMessage(this._decomposeMiliseconds(timeDiff));
    this.timer = setTimeout(this._tick.bind(this), Countdowner.MS_IN_SEC);
  }

  this._display(message);
}

Countdowner.prototype._display = function(text) {
    document.getElementById(this.ID).innerHTML = text;
};

/**
 * @param {Object.<string, number>} remainingTime
 */
Countdowner.prototype._getCountdownMessage = function(remainingTime) {
  return remainingTime.days + ' dnů ' + remainingTime.hours + ' hodin ' +
    remainingTime.minutes + ' minut a ' + remainingTime.seconds + ' vteřin';
};

if(typeof module !== "undefined" && module !== null) {
  module.exports = Countdowner;
}