const { Model, Presenter } = require('./model')
const crypto = require('crypto')

class Users extends Model {
  static get collection() {
    return this.db.collection('users')
  }

  static seed() {
    this.collection.remove({})

    let pwd = crypto.createHash('sha256').update('QWEqwe123').digest('base64')

    this.collection.insert({
      name: 'Dmitry',
      email: 'test@gmail.com',
      password: pwd,
      role: 'admin'
    })
  }

  static encrypt(password) {
    return crypto.createHash('sha256').update(password).digest('base64')
  }

  static token() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(48, (err, buffer) => {
        resolve(buffer.toString('hex'))
      })
    })
  }

  static getByToken(token) {
    return new Promise((resolve, reject) => {
      this.find({ token: token }).then(user => {
        resolve(user)
      }, err => {
        reject(err)
      })
    })
  }
}

class User extends Presenter {
  constructor(user) {
    super(user)
    this.expose('name')
    this.expose('email')
    this.expose('role')
  }

  with_token() {
    this.expose('token')
    return this
  }
}

module.exports.Users = Users
module.exports.User = User
