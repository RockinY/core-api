// @flow
import { Router } from 'express'
import graphiql from './graphiql'
import graphql from './graphql'

const apiRouter = Router()

// if (process.env.NODE_ENV !== 'production') {
//   apiRouter.use('/playground', graphiql)
// }
apiRouter.use('/playground', graphiql)
apiRouter.use('/', graphql)

export default apiRouter
