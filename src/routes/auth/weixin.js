// @flow
import { Router } from 'express'
import { createSigninRoutes } from './create-signin-routes'

const wechatAuthRouter = Router()
const { main, callbacks } = createSigninRoutes('wechat', {
  scope: 'snsapi_login'
})

wechatAuthRouter.get('/', main)
wechatAuthRouter.get('/callback', ...callbacks)

export default wechatAuthRouter