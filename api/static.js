module.exports = (router) => {
  const express = require('express')

  router.use(express.static(__dirname + '/../public'))
}
