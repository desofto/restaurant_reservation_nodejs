const auth = require('../helpers/auth')
const { Users, User } = require('../models/users')
const db = require('../helpers/mongodb').db

module.exports = (router) => {
  router.get('/api/v1/users', auth.isAuthenticated, (req, res) => {
    Users.all().then(users => {
      users = users.map(user => new User(user).json)
      res.json(users)
    }, (err) => {
      res.status(500).send(err)
    })
  })

  router.delete('/api/v1/users/:id', auth.isAuthenticated, (req, res) => {
    Users.destroy(req.params.id).then(() => {
      res.send('ok')
    }, err => {
      res.status(422).send(err)
    })
  })

  router.post('/api/v1/users', (req, res) => {
    Users.authenticate(req.body.email, req.body.password).then(user => {
      res.json(new User(user).with_token().json)
    }, err => {
      res.status(401).send(err)
    })
  })

  router.post('/api/v1/users/logout', auth.isAuthenticated, (req, res) => {
    Users.find({ token: req.params.token }).then(user => {
      Users.reset_token(user)
    }, err => {
    })
    res.send('ok')
  })
}
