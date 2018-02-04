const ObjectID = require('mongodb').ObjectID

class Model {
  static get db() {
    return require('../helpers/mongodb').db
  }

  static all(query = {}) {
    return new Promise((resolve, reject) => {
      this.collection.find(query).toArray((err, users) => {
        if(err) return reject(err)

        resolve(users)
      })
    })
  }

  static find(query = {}) {
    return new Promise((resolve, reject) => {
      this.collection.findOne(query, (err, user) => {
        if(err || !user) return reject(err)

        resolve(user)
      })
    })
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      this.find({ _id: new ObjectID(id) }).then(user => {
        resolve(user)
      }, err => {
        reject(err)
      })
    })
  }

  static update(user) {
    return new Promise((resolve, reject) => {
      this.collection.update({ _id: new ObjectID(user._id) }, user, (err, result) => {
        if(err) return reject(err)

        resolve()
      })
    })
  }

  static destroy(id) {
    return new Promise((resolve, reject) => {
      this.collection.deleteOne({ _id: new ObjectID(id) }, (err, obj) => {
        if(err) return reject(err)

        resolve()
      })
    })
  }
}

class Presenter {
  constructor(model) {
    this.model = model
    this._json = {}
    this.expose({ id: '_id' })
  }

  expose(name) {
    if(typeof name === 'string' || name instanceof String) {
      this._json[name] = this.model[name]
    } else if(name instanceof Object) {
      Object.keys(name).forEach(key => {
        this._json[key] = this.model[name[key]]
      })
    }
  }

  get json() {
    return this._json
  }
}

module.exports.Model = Model
module.exports.Presenter = Presenter
