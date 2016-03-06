/**
 * @param {Date} targetDate
 * @return {Object.<string, number>}
 */
var Countdowner = function(targetDate) {
  if(!(targetDate instanceof Date)) {
    throw new Error('Only Date object is accepted as a constructor parameter');
  }

  this.targetDate = targetDate;
}

Countdowner.MS_IN_SEC = 1000;
Countdowner.MS_IN_MIN = Countdowner.MS_IN_SEC * 60;
Countdowner.MS_IN_HOUR = Countdowner.MS_IN_MIN * 60;
Countdowner.MS_IN_DAY = Countdowner.MS_IN_HOUR * 24;

/**
 * @param {number} miliseconds
 */
Countdowner.decomposeMiliseconds = function(miliseconds) {
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
}

/**
 * @param {Object.<string, number>} remainingTime
 */
Countdowner.prototype.getCountdownMessage = function(remainingTime) {
  return remainingTime.days + ' dnů' + remainingTime.hours + ' hodin' +
    remainingTime.minutes + ' minut a ' + remainingTime.seconds + ' vteřin';
}

if(module != null) {
  module.exports = Countdowner;
}