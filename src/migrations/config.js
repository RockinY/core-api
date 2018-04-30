require('dotenv').config()

module.exports = {
  driver: 'rethinkdbdash',
  db: process.env.NODE_ENV === 'test' ? 'xlab_testing' : process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  migrationsDirectory: 'src/migrations'
}
