const webpack = require('webpack')
const config = require('./webpack.common.js')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

config.plugins.push(
  new UglifyJSPlugin({
    sourceMap: true
  })
)
config.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  })
)

module.exports = config
