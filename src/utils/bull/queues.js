import type { Queues } from '../types'
import {
  MESSAGE_NOTIFICATION,
  MENTION_NOTIFICATION,
  DIRECT_MESSAGE_NOTIFICATION,
  REACTION_NOTIFICATION,
  THREAD_REACTION_NOTIFICATION,
  CHANNEL_NOTIFICATION,
  COMMUNITY_NOTIFICATION,
  THREAD_NOTIFICATION,
  PRIVATE_CHANNEL_REQUEST_SENT,
  PRIVATE_CHANNEL_REQUEST_APPROVED,
  PRIVATE_COMMUNITY_REQUEST_SENT,
  PRIVATE_COMMUNITY_REQUEST_APPROVED,
  TRACK_USER_LAST_SEEN,
  SEND_PUSH_NOTIFICATIONS
} from './constants'
import createQueue from './createQueue'
const EventEmitter = require('events')

exports.QUEUE_NAMES = {
  // Notifications
  sendThreadNotificationQueue: THREAD_NOTIFICATION,
  sendCommunityNotificationQueue: COMMUNITY_NOTIFICATION,
  trackUserThreadLastSeenQueue: TRACK_USER_LAST_SEEN,
  sendReactionNotificationQueue: REACTION_NOTIFICATION,
  sendThreadReactionNotificationQueue: THREAD_REACTION_NOTIFICATION,
  sendPrivateChannelRequestQueue: PRIVATE_CHANNEL_REQUEST_SENT,
  sendPrivateChannelRequestApprovedQueue: PRIVATE_CHANNEL_REQUEST_APPROVED,
  sendPrivateCommunityRequestQueue: PRIVATE_COMMUNITY_REQUEST_SENT,
  sendPrivateCommunityRequestApprovedQueue: PRIVATE_COMMUNITY_REQUEST_APPROVED,
  sendChannelNotificationQueue: CHANNEL_NOTIFICATION,
  sendDirectMessageNotificationQueue: DIRECT_MESSAGE_NOTIFICATION,
  sendMessageNotificationQueue: MESSAGE_NOTIFICATION,
  sendMentionNotificationQueue: MENTION_NOTIFICATION,
  sendNotificationAsPushQueue: SEND_PUSH_NOTIFICATIONS
}

// We add one error listener per queue, so we have to set the max listeners
// to whatever it is set to + the amount of queues passed in
// $FlowIssue
EventEmitter.defaultMaxListeners =
  // $FlowIssue
  Object.keys(exports.QUEUE_NAMES).length + EventEmitter.defaultMaxListeners;

// Create all the queues, export an object with all the queues
const queues: Queues = Object.keys(exports.QUEUE_NAMES).reduce(
  (queues, name) => {
    queues[name] = createQueue(exports.QUEUE_NAMES[name]);
    return queues;
  },
  {}
);

// Needs to be module.exports so import { sendEmailValidationEmailQueue } from 'queues' works
// it wouldn't work with export default queues and for some reason export { ...queues } doesn't either
module.exports = queues;