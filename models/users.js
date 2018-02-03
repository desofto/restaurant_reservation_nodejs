const collection = require('../helpers/mongodb').db.collection('users')
const crypto = require('crypto')
const ObjectID = require('mongodb').ObjectID

module.exports = {
  collection: collection,

  seed() {
    this.collection.remove({})

    let pwd = crypto.createHash('sha256').update('QWEqwe123').digest('base64')

    this.collection.insert({
      name: 'Dmitry',
      email: 'test@gmail.com',
      password: pwd,
      role: 'admin'
    })
  },

  encrypt(password) {
    return crypto.createHash('sha256').update(password).digest('base64')
  },

  token() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(48, (err, buffer) => {
        resolve(buffer.toString('hex'))
      })
    })
  },

  all(query = {}) {
    return new Promise((resolve, reject) => {
      this.collection.find(query).toArray((err, users) => {
        if(err) return reject(err)

        resolve(users)
      })
    })
  },

  find(query = {}) {
    return new Promise((resolve, reject) => {
      this.collection.findOne(query, (err, user) => {
        if(err || !user) return reject(err)

        resolve(user)
      })
    })
  },

  getById(id) {
    return new Promise((resolve, reject) => {
      this.find({ _id: new ObjectID(id) }).then(user => {
        resolve(user)
      }, err => {
        reject(err)
      })
    })
  },

  update(user) {
    return new Promise((resolve, reject) => {
      this.collection.update({ _id: new ObjectID(user._id) }, user, (err, result) => {
        if(err) return reject(err)

        resolve()
      })
    })
  },

  destroy(id) {
    return new Promise((resolve, reject) => {
      this.collection.deleteOne({ _id: new ObjectID(id) }, (err, obj) => {
        if(err) return reject(err)

        resolve()
      })
    })
  },

  getByToken(token) {
    return new Promise((resolve, reject) => {
      this.find({ token: token }).then(user => {
        resolve(user)
      }, err => {
        reject(err)
      })
    })
  }
}
