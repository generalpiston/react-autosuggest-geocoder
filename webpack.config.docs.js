var path = require('path')

module.exports = {
  entry: './docs/basic.js',
  output: {
    filename: 'basic.bundle.js',
    path: path.join(__dirname, 'docs')
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: [/node_modules/, /lib/]
    }],
    noParse: ['node_modules']
  }
}
