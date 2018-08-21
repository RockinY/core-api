import jwt from 'jsonwebtoken'

const debug = require('debug')('api')

export default (req, res, next) => {
  if (req.headers && !req.headers.cookie && req.headers.authorization) {
    const token = req.headers.authorization.replace(/^\s*Bearer\s*/, '')
    debug(token)
    try {
      const decoded = jwt.verify(token, process.env.API_TOKEN_SECRET)
      debug(decoded)
      if (decoded.cookie) req.headers.cookie = decoded.cookie
    } catch (err) {}
  }
  next()
}
