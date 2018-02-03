const auth = require('../helpers/auth')
const Users = require('../models/users')
const db = require('../helpers/mongodb').db

module.exports = (router) => {
  router.get('/api/v1/users', auth.isAuthenticated, (req, res) => {
    Users.all().then(users => {
      users = users.map(user => {
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })

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
    Users.find({ email: req.body.email, password: Users.encrypt(req.body.password) }).then(user => {
      Users.token().then(token => {
        user.token = token
        Users.update(user).then(() => {
          res.json({
            id: user._id,
            email: user.email,
            role: user.role,
            token: user.token
          })
        }, err => {
          res.status(500).send(err)
        })
      })
    }, err => {
      res.status(401).send('Wrong email and/or password')
    })
  })

  router.post('/api/v1/users/logout', auth.isAuthenticated, (req, res) => {
    User.find({ token: req.params.token }).then(user => {
      Users.token().then(token => {
        user.token = token
        User.update(user)
      })
    }, () => {
    })
    res.send('ok')
  })
}
