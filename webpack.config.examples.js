var path = require('path')

module.exports = {
  entry: './examples/basic.js',
  output: {
    filename: 'basic.js',
    path: path.join(__dirname, 'lib', 'examples')
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
