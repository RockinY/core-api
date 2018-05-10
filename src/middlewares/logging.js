const debug = require('debug')('api:middlewares:logging')

module.exports = (req, res, next) => {
  debug(`requesting ${req.url}`)
  next()
}
