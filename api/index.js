module.exports = (router, db) => {
  require('./users')(router, db)
  require('./static')(router)
}
