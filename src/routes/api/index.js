// @flow
import { Router } from 'express'
import graphiql from './graphiql'
import graphql from './graphql'
import webhook from './webhook'

const apiRouter = Router()

if (process.env.NODE_ENV !== 'production') {
  apiRouter.use('/playground', graphiql)
}
apiRouter.use('/webhook', webhook)
apiRouter.use('/', graphql)

export default apiRouter
