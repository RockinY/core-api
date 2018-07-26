import { Router } from 'express'

const logoutRouter = Router()

logoutRouter.get('/', (req, res) => {
  req.session = null
  return res.redirect(process.env.WEB_CLIENT_URL)
})

export default logoutRouter
