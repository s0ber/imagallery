const path = require('path')
const webpack = require('webpack')
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'

const plugins = []

if (isProduction) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new UnminifiedWebpackPlugin()
  )
}

module.exports = {
  devtool: 'source-map',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve('./build'),
    filename: 'imagallery.min.js',
    library: 'Imagallery',
    libraryTarget: 'umd'
  },
  resolve: {
    modules: [process.cwd(), 'node_modules'],
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: plugins
}
