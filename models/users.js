const { Model, Presenter } = require('./model')
const crypto = require('crypto')

class Users extends Model {
  static get collection() {
    return this.db.collection('users')
  }

  static seed() {
    this.collection.remove({})

    this.collection.insert({
      name: 'Dmitry',
      email: 'test@gmail.com',
      password: Users.encrypt('QWEqwe123'),
      role: 'admin'
    })
  }

  static encrypt(password) {
    return crypto.createHash('sha256').update(password).digest('base64')
  }

  static reset_token(user) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(48, (err, buffer) => {
        user.token = buffer.toString('hex')
        Users.update(user).then(() => {
          resolve(user)
        }, error => {
          reject(error)
        })
      })
    })
  }

  static authenticate(email, password) {
    return new Promise((resolve, reject) => {
      Users.find({ email: email, password: Users.encrypt(password) }).then(user => {
        Users.reset_token(user).then(user => {
          resolve(user)
        }, error => {
          reject(error)
        })
      }, error => {
        reject('Wrong email and/or password')
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
