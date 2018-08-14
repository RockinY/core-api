// @flow
import { Router } from 'express'
import githubAuthRouters from './github'
import alipayAuthRoutes from './alipay'
import wechatAuthRoutes from './weixin'
import logoutRoutes from './logout'

const authRouter = Router()

authRouter.use('/github', githubAuthRouters)
authRouter.use('/alipay', alipayAuthRoutes)
authRouter.use('/wechat', wechatAuthRoutes)
authRouter.use('/logout', logoutRoutes)

export default authRouter
