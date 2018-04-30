import rethinkdbdash from 'rethinkdbdash'

var r = rethinkdbdash({
  db: process.env.DATABASE_NAME,
  max: 500,
  buffer: 5,
  timeoutGb: 60 * 1000,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
})

export default r