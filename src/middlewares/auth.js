import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  if (req.headers && !req.headers.cookie && req.headers.authorization) {
    const token = req.headers.authorization.replace(/^\s*Bearer\s*/, '')
    try {
      const decoded = jwt.verify(token, process.env.API_TOKEN_SECRET)
      if (decoded.cookie) req.headers.cookie = decoded.cookie
    } catch (err) {}
  }
  next()
}
