// @flow
import { Router } from 'express'
import { createSigninRoutes } from './create-signin-routes'

const alipayAuthRouter = Router()
const { main, callbacks } = createSigninRoutes('Alipay', {
  scope: 'auth_user'
})

alipayAuthRouter.get('/', main)
alipayAuthRouter.get('/callback', ...callbacks)

export default alipayAuthRouter