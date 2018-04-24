// @flow
import compression from 'compression'
import { createServer } from 'http'
import express from 'express'

const debug = require('debug')('api')
debug('Server starting...')
debug('logging with debug enabled!')

/* ----------- API server ----------- */
const app = express()

/* ----------- Middlewares ----------- */
// 1. Send all responses as gzip
app.use(compression())

/* ----------- Routes ----------- */
app.get('/', (req, res) => res.send('Hello World!'))

/* ----------- Create server ----------- */
const server = createServer(app)

server.listen(3000)
debug('Server is running!')
