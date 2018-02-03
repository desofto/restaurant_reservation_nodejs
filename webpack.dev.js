const common = require('./webpack.common.js')
const path = require('path')

module.exports = Object.assign(common, {
  devtool: '#inline-source-map',

  devServer: {
    contentBase: 'public',
    port: 3000,

    after(app){
      process.env.PORT = 8080
      require('./server')
    },

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
