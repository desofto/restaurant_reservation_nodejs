if(process.env.NODE_ENV !== 'production') require('dotenv').load()

const port = process.env.PORT || 8080

const express = require('express')

const MongoClient = require('mongodb').MongoClient

const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

MongoClient.connect(process.env.mongodb, (err, client) => {
  if (err) throw err

  let db = client.db('restaurant_reservation_nodejs')

  // db.collection('users').remove({})

  // const crypto = require('crypto')
  // let pwd = crypto.createHash('sha256').update('QWEqwe123').digest('base64')

  // db.collection('users').insert({
    // name: 'Dmitry',
    // email: 'test@gmail.com',
    // password: pwd,
    // role: 'admin'
  // })

  require('./router')(app, db)

  app.listen(port, () => {
    console.log(`Listening on ${port}`)
  })
})
