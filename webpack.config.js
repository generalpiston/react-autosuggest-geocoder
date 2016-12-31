var path = require('path');

module.exports = {
  entry: {
    'basic': './examples/src/basic/index.js'
  },
  output: {
    path: path.join(__dirname, 'examples', 'dist'),
    filename: '[name].entry.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: [/node_modules/, /lib/]
    }]
  },
  node: {
    global: true
  }
};
