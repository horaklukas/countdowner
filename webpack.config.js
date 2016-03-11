var path = require('path');

module.exports = {
  entry: './src/countdowner.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'countdowner.min.js',
    library: 'Countdowner'
  }
};