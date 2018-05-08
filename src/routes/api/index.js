// @flow
import { Router } from 'express'
import graphiql from './graphiql'
import graphql from './graphql'

const apiRouter = Router()

if (process.env.NODE_ENV === 'development') {
  apiRouter.use('/graphiql', graphiql)
}

apiRouter.use('/', graphql)

export default apiRouter
