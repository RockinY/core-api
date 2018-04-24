// @flow
import rethinkdbdash from 'rethinkdbdash'

var r = rethinkdbdash({
  db: 'xlab',
  max: 500,
  buffer: 5,
  timeoutGb: 60 * 1000,
  host: 'localhost',
  port: 28015
})

export default r
