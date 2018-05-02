const debug = require('debug')('middlewares:logging')

module.exports = (req, res, next) => {
  debug(`requesting ${req.url}`)
  next()
}
