if(process.env.NODE_ENV !== 'production') require('dotenv').load()

const port = process.env.PORT || 8080

const express = require('express')

const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const cors = require('cors')
app.use(cors())

require('./helpers/mongodb').connect().then(() => {
  //require('./models/users').Users.seed()

  require('./router')(app)

  app.listen(port, () => {
    console.log(`Listening on ${port}`)
  })

}, error => {
  console.log('MongoDB error')
})
