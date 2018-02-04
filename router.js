module.exports = (app) => {
  const express = require('express')
  const router = express.Router()

  router.use((req, res, next) => {
    console.log(req.method + " " + req.path)
    next()
  })

  require('./api/index')(router)

  router.use(express.static(__dirname + '/../public'))

  app.use("/", router)

  const map = {
    '/': 'public/index.html',
    '/admin.*': 'public/admin/index.html',
    '/user.*': 'public/user/index.html',
    '/bootstrap.min.js.map': 'node_modules/bootstrap/dist/js/bootstrap.min.js.map',
    '/fonts/fontawesome-webfont.*': 'node_modules/font-awesome*'
  }

  app.use("*", (req, res) => {
    const fs = require('fs')

    let path = req.originalUrl.split('?')[0]
    let mapped_path = map[path]

    let key = Object.keys(map).find(key => {
      return path.match(`^${key}$`)
    })

    if(key) {
      let mapped_path = map[key]
      if(mapped_path[mapped_path.length-1] == '*') {
        mapped_path = mapped_path.slice(0, mapped_path.length-1) + path
      }
      return res.sendFile(`${__dirname}/${mapped_path}`)
    }

    fs.readFile(`./node_modules${path}/package.json`, (error, data) => {
      if(error) return res.status(404).send('Not Found')

      let pkg = JSON.parse(data)

      res.sendFile(`${__dirname}/node_modules${path}/${pkg['main']}`)
    })
  })
}
