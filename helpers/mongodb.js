const MongoClient = require('mongodb').MongoClient

module.exports = {
  db: null,

  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(process.env.mongodb, (err, client) => {
        if (err) return reject()

        this.db = client.db('restaurant_reservation_nodejs')
        resolve()
      })
    })
  }
}
