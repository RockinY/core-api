// @flow
import compression from 'compression'
import { createServer } from 'http'
import express from 'express'
import toobusy from './middlewares/toobusy.js'
import addSecurityMiddleware from './middlewares/security'

require('dotenv').config()
const debug = require('debug')('api')
debug('Server starting...')
debug('logging with debug enabled!')

/* ----------- API server ----------- */
const app = express()

/* ----------- Middlewares ----------- */
// 1. Send all responses as gzip
app.use(compression())
// 2. Toobusy situation
app.use(toobusy)
// 3. Increase security
addSecurityMiddleware(app)

/* ----------- Routes ----------- */
app.get('/', (req, res) => res.send('Hello World!'))

/* ----------- Create server ----------- */
const server = createServer(app)

server.listen(3000)
debug('Server is running!')
