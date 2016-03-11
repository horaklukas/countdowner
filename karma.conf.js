module.exports = function(config) {
  config.set({
    // frameworks to use
    frameworks: ['commonjs', 'mocha', 'chai', 'sinon'],

    // list of files / patterns to load in the browser
    files: [
      'src/**/*.js',
      './node_modules/function-bind/*.js',
      'test/*.js'
    ],

    // preprocess matching files before serving them to the browser
    preprocessors: {
      'src/**/*.js': ['commonjs'],
      './node_modules/function-bind/*.js': ['commonjs'],
      './test/*.js': ['commonjs']
    },

    // test results reporter to use
    reporters: ["spec"],
      specReporter: {
        maxLogLines: 5,         // limit number of lines logged per test
        suppressErrorSummary: true,  // do not print error summary
        suppressFailed: false,  // do not print information about failed tests
        suppressPassed: false,  // do not print information about passed tests
        suppressSkipped: false,  // do not print information about skipped tests
      },

    // report which tests are slower than 500ms
    reportSlowerThan : 500,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    browsers: [process.env.TRAVIS_CI ? 'PhantomJS' : 'Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
  })
}
