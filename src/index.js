// @flow
import './utils/dotenv'
import compression from 'compression'
import { createServer } from 'http'
import express from 'express'
import { ApolloEngine } from 'apollo-engine'
import toobusy from './middlewares/toobusy'
import { apolloUploadExpress } from 'apollo-upload-server'
import addSecurityMiddleware from './middlewares/security'
import logging from './middlewares/logging'
import jwtAuth from './middlewares/auth'
import initPassport from './authentication'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from './middlewares/session'
import passport from 'passport'
import threadParamRedirect from './middlewares/threadParam'
import Raven from './utils/raven'
import authRoutes from './routes/auth'
import apiRouter from './routes/api'
import createSubscriptionsServer from './utils/createSubscriptionServer'
import querystring from 'query-string'
import hash from 'object-hash'

const debug = require('debug')('api')
debug('Server starting...')
debug('logging with debug enabled!')

/* ----------- Authentication ----------- */
initPassport()

/* ----------- API server ----------- */
const app = express()
app.set('trust proxy', true)

/* ----------- Middlewares ----------- */
// *. Send all responses as gzip
app.use(compression())
// *. Toobusy situation
app.use(toobusy)
// *. Increase security
addSecurityMiddleware(app)
// *. Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(logging)
}
// *. JWT header cookie
app.use(jwtAuth)
// *. Cross Origin Request
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:3006', process.env.WEB_CLIENT_URL],
  credentials: true
}))
// *. Cookie parser
app.use(cookieParser())
// *. Enable file upload
app.use(apolloUploadExpress({
  maxFileSize: 25 * 1024 * 1024
}))
// *. JSON body parser
app.use(bodyParser.json())
// *. Form body parser
app.use(bodyParser.urlencoded({ extended: false }))
// *. Session
app.use(session)
// *. passport
app.use(passport.initialize())
app.use(passport.session())
// *. redirect
app.use(threadParamRedirect)
// *. debug
if (process.env.NODE_ENV === 'development') {

  const queryLog = {}

  // parses shortlinks and redirects to the GraphiQL editor
  app.use('/goto', (req: express$Request, res: express$Response) => {
    const { id } = req.query
    // $FlowFixMe
    if (!queryLog[id]) {
      console.error('Failed to find a stored query')
      return res.status(404).end()
    }
    return res.redirect(queryLog[id])
  })

  // peeks at incoming /graphql requests and builds shortlinks
  app.use('/api', (req: express$Request, res: express$Response, next) => {
    // $FlowFixMe
    const { query, variables } = req.body
    const queryParams = querystring.stringify({
      query,
      variables: JSON.stringify(variables)
    })
    // hash query into id so that identical queries occupy
    // the same space in the queryLog map.
    const id = hash({ query, variables })
    // $FlowFixMe
    queryLog[id] = `${process.env.HOST_URL}/api/playground?${queryParams}`
    console.log(
      'Query was made, inspect:',
      // $FlowFixMe
      `${process.env.HOST_URL}/goto?id=${id}`
    )
    // finally pass requests to the actual /graphql endpoint
    next()
  })
}
// *. Catch Error
app.use(
  (
    err: Error,
    req: express$Request,
    res: express$Response,
    next: express$NextFunction
  ) => {
    if (err) {
      console.error(err)
      res
        .status(500)
        .send(
          'Oops, something went wrong! Our engineers have been alerted and will fix this asap.'
        )
      Raven.captureException(err)
    } else {
      return next()
    }
  }
)

/* ----------- Routes ----------- */
// Authentication
app.use('/auth', authRoutes)
// GraphQL
app.use('/api', apiRouter)
// Testing
app.get('/', (
  req: express$Request,
  res: express$Response
) => res.send('API server for xlab.'))

/* ----------- Create server ----------- */
const server = createServer(app)

// Create subscriptions server at /websocket
createSubscriptionsServer(server, '/websocket')

server.listen(3000)

debug('Server is running!')

/* ----------- Handle Errors ----------- */
process.on('unhandleRejection', async err => {
  console.error('Unhandled rejection', err)
  try {
    await new Promise(resolve => Raven.captureException(err, resolve))
  } catch (err) {
    console.error('Raven error', err)
  } finally {
    process.exit(1)
  }
})

process.on('uncaughtException', async err => {
  console.error('Uncaught exception', err)
  try {
    await new Promise(resolve => Raven.captureException(err, resolve))
  } catch (err) {
    console.error('Raven error', err)
  } finally {
    process.exit(1)
  }
})
