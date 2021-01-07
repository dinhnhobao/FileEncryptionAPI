const path = require('path');

module.exports = {
  node: {
      fs: 'empty',
      net: 'empty'
  },
  entry: path.resolve(__dirname, 'src') + '/main/index.js',
};