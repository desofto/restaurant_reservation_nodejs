const webpack = require('webpack')
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally')
const path = require('path')

module.exports = {
  entry: {
    application: './js/application.js',
    index: './app/index.js',
    admin: './app/admin.js',
    wizard: './app/wizard.js'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public')
  },

  devtool: '#inline-source-map',

  module: {
    rules: [
      {
        test: /\.vue?$/,
        exclude: /node_modules/,
        use: {
          loader: 'vue-loader',
          options: {
            presets: ['es5']
          }
        }
      }
    ]
  },

  plugins: [
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
