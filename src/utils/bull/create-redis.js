// @flow
import Redis from 'ioredis'

const config = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
}

export default (extraConfig?: Object) =>
  new Redis({
    ...config,
    ...extraConfig
  })
