const webpack = require('webpack')
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    css: './css/application.scss',
    application: './js/application.js',
    index: './app/index.js',
    admin: './app/admin.js',
    wizard: './app/wizard.js'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './public')
  },

  module: {
    rules: [
      {
        test: /\.vue?$/,
        exclude: /node_modules/,
        use: {
          loader: 'vue-loader',
          options: {
            presets: ['es2015']
          }
        }
      },

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader', options: { minimize: process.env.NODE_ENV } }
          ]
        })
      },

      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader', options: { minimize: process.env.NODE_ENV } },
            'sass-loader'
          ]
        })
      },

      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',    // where the fonts will go
            publicPath: '../'       // override the default path
          }
        }]
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'application.css',
      allChunks: true
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "commons.js"
    }),

    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),

    new MergeIntoSingleFilePlugin({
      files: {
        "common.js": [
          "node_modules/jquery/dist/jquery.min.js",
          //"node_modules/popper.js/dist/popper.min.js",
          "node_modules/bootstrap/dist/js/bootstrap.min.js",
          "js/jqBootstrapValidation.js",
          "js/jquery.easing.js",
          "node_modules/vue/dist/vue.min.js",
          "node_modules/vuex/dist/vuex.min.js",
          "node_modules/vue-ls/dist/vue-ls.js",
          "node_modules/vue-router/dist/vue-router.min.js",
          "node_modules/vue-resource/dist/vue-resource.min.js"
        ]
      }
    })
  ]
}
