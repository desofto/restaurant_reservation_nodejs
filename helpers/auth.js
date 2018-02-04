const { Users } = require('../models/users')

function notAuthenticated(res) {
  res.status(401).json({ status: 'error', error: 'Not Authorized.' })
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
