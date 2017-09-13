var path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'lib'),
    library: 'ReactAutosuggestGeocoder',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.scss', '.json']
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      use: ['json-loader']
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      exclude: /node_modules/
    }]
  },
  node: {
    global: false
  }
};
