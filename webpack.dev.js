const config = require('./webpack.common.js')
const NodemonPlugin = require('nodemon-webpack-plugin')
const path = require('path')

config.plugins.push(
  new NodemonPlugin({
    watch: [
      path.resolve('./server.js'),
      path.resolve('./router.js'),
      path.resolve('./api'),
      path.resolve('./helpers'),
      path.resolve('./models')
    ],
    script: './server.js'
  })
)

module.exports = Object.assign(config, {
  devtool: '#inline-source-map',

  devServer: {
    contentBase: 'public',
    port: 3000,

    proxy: {
      "/api/*": {
        target: "http://localhost:8080",
        bypass(req, res, proxyOptions) {
          if(req.originalUrl.match(/^\/admin/)) {
            return "/admin/index.html"
          }
          if(req.originalUrl.match(/^\/user/)) {
            return "/user/index.html"
          }
          return false
        }
      }
    }
  }
})
