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
      include: [
        path.resolve(__dirname, 'examples', 'src'),
        path.resolve(__dirname, 'node_modules', 'react-autosuggest-geocoder', 'src')
      ]
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: [
        path.resolve(__dirname, 'node_modules', 'react-autosuggest-geocoder', 'src')
      ]
    }]
  },
  node: {
    global: true
  }
};
