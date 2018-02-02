const port = 3000

const express = require('express')

const MongoClient = require('mongodb').MongoClient
const db = require('./config/db')

const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const sass = require('node-sass')
sass.render({
  file: __dirname + '/css/application.scss',
  outFile: __dirname + '/public/application.css'
}, function(error, result) {
  if(error) return console.log(error)

  const fs = require('fs')
  fs.writeFile(__dirname + '/public/application.css', result.css)
})

MongoClient.connect(db.url, (err, client) => {
  if (err) throw err

  let db = client.db('restaurant_reservation_nodejs')

  db.collection('users').remove({})

  const crypto = require('crypto')
  let pwd = crypto.createHash('sha256').update('QWEqwe123').digest('base64')

  db.collection('users').insert({
    name: 'Dmitry',
    email: 'test@gmail.com',
    password: pwd,
    role: 'admin'
  })

  require('./router')(app, db)

  app.listen(port)
})
