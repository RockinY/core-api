// @flow
import { Router } from 'express'
import githubAuthRouters from './github'
import logoutRoutes from './logout'

const authRouter = Router()

authRouter.use('/github', githubAuthRouters)
authRouter.use('/logout', logoutRoutes)

export default authRouter
