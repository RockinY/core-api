// @flow
import createQueue from './create-queue'
import type { Queues } from './types'
import EventEmitter from 'events'

import {
  CHANNEL_NOTIFICATION
} from '../athenaConstants'

exports.QUEUE_NAMES = {
  // notifications
  sendChannelNotificationQueue: CHANNEL_NOTIFICATION
}

EventEmitter.defaultMaxListeners = Object.keys(exports.QUEUE_NAMES).length + EventEmitter.defaultMaxListeners

const queues: Queues = Object.keys(exports.QUEUE_NAMES).reduce(
  (queues, name) => {
    queues[name] = createQueue(exports.QUEUE_NAMES[name])
    return queues
  },
  {}
)

module.exports = queues
