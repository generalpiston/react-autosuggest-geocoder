var path = require('path')

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
    extensions: ['', '.js', '.scss', '.json']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loaders: ['json']
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass'],
      exclude: /node_modules/
    }]
  },
  node: {
    global: false
  }
}
