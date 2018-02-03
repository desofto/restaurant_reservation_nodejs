module.exports = (router) => {
  require('./users')(router)
  require('./static')(router)
}
