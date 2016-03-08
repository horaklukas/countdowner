if (typeof process === 'object') {
  // Initialize node environment
  global.expect = require('expect');
  global.sinon = require('sinon');
  require('jsdom-global')();
} else {
  window.require = function (path) {
    if(path == '../src/countdowner') {
      return Countdowner;
    } 
  }
}