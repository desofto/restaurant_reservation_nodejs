module.exports = (router, db) => {
  const crypto = require('crypto')
  const ObjectID = require('mongodb').ObjectID

  router.get('/api/v1/users', (req, res) => {
    let token = req.query.token
    db.collection('users').findOne({ token: token }, (err, user) => {
      if(err || !user) return res.status(401).send('Wrong token')

      db.collection('users').find({}).toArray((err, users) => {
        if(err) return res.status(500).send(err)

        res.json(users.map(user => {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }))
      })
    })
  })

  router.delete('/api/v1/users/:id', (req, res) => {
    let token = req.query.token
    db.collection('users').findOne({ token: token }, (err, user) => {
      if(err || !user) return res.status(401).send('Wrong token')

      db.collection('users').deleteOne({ _id: new ObjectID(user._id) }, (err, obj) => {
        if(err) return res.status(422).send(err)

        res.send('ok')
      })
    })
  })

  router.post('/api/v1/users', (req, res) => {
    let pwd = crypto.createHash('sha256').update(req.body.password).digest('base64')

    db.collection('users').findOne({ email: req.body.email, password: pwd }, (err, user) => {
      if(err) return res.status(401).send('Wrong email and/or password')

      crypto.randomBytes(48, (err, buffer) => {
        user.token = buffer.toString('hex')
        db.collection('users').update({ _id: new ObjectID(user._id) }, user, (err, result) => {
          if(err) res.status(500).send(err)

          res.json({
            id: user._id,
            email: user.email,
            role: user.role,
            token: user.token
          })
        })
      })
    })
  })

  router.post('/api/v1/users/logout', (req, res) => {
    let token = req.query.token
    db.collection('users').findOne({ token: token }, (err, user) => {
      if(err || !user) return

      crypto.randomBytes(48, (err, buffer) => {
        user.token = buffer.toString('hex')
        db.collection('users').update({ _id: new ObjectID(user._id) }, user)
      })
    })
    res.send('ok')
  })
}
