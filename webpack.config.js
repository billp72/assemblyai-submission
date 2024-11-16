const path = require('path');

module.exports = {
  entry: {
    bundle1: './module1.ts',
    bundle2: './module2.ts'
  },
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: '[name].bundle.js' // Use the entry name to generate unique filenames
  }
};