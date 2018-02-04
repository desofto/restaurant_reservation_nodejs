const { Users } = require('../models/users')

function notAuthenticated(res) {
  res.status(401).send('Not Authorized.')
}

module.exports = {
  isAuthenticated(req, res, next) {
     if(!req.query.token) {
      notAuthenticated(res)
    } else {
      Users.getByToken(req.query.token).then(user => {
        next()
      }, () => {
        notAuthenticated(res)
      })
    }
  }
}
