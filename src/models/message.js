// @flow
import db from '../db'
import { NEW_DOCUMENTS } from './utils'
import { createChangefeed } from '../utils/changeFeed'
import { setThreadLastActive } from './thread'
import {
  sendDirectMessageNotificationQueue,
  sendMessageNotificationQueue
} from '../utils/bull/queues'

export type MessageTypes = 'text' | 'media'
export type Message = Object

export const getManyMessages = (messageIds: string[]): Promise<Message[]> => {
  return db
    .table('messages')
    .getAll(...messageIds)
    .run()
    .then(messages => {
      return messages.filter(message => message && !message.deletedAt)
    })
}

export const getMessage = (messageId: string): Promise<Message> => {
  return db
    .table('messages')
    .get(messageId)
    .run()
    .then(message => {
      if (!message || message.deletedAt) {
        return null
      }
      return message
    })
}

type BackwardsPaginationOptions = { last?: number, before?: number | Date }

const getBackwardsMessages = (threadId: string, { last, before }: BackwardsPaginationOptions) => {
  return db
    .table('messages')
    .between(
      [threadId, db.minval],
      [threadId, before ? new Date(before) : db.maxval],
      { index: 'threadIdAndTimestamp' }
    )
    .orderBy({ index: db.desc('threadIdAndTimestamp') })
    .filter(db.row.hasFields('deletedAt').not())
    .limit(last || 0)
    .run()
}

type ForwardsPaginationOptions = { first?: number, after?: number | Date };

const getForwardMessages = (threadId: string, { first, after }: ForwardsPaginationOptions) => {
  return db
    .table('messages')
    .between(
      [threadId, after ? new Date(after) : db.minval],
      [threadId, db.maxval],
      { index: 'threadIdAndTimestamp', leftBound: 'open', rightBound: 'closed' }
    )
    .orderBy({ index: 'threadIdAndTimestamp' })
    .filter(db.row.hasFields('deletedAt').not())
    .limit(first || 0)
    .run()
}

export const getMessages = (
  threadId: string,
  {
    first,
    after,
    last,
    before
  }: { ...BackwardsPaginationOptions, ...ForwardsPaginationOptions }
): Promise<Array<Message>> => {
  // $FlowIssue
  if (last || before) return getBackwardsMessages(threadId, { last, before })
  // $FlowIssue
  return getForwardMessages(threadId, { first, after })
}

export const getLastMessage = (threadId: string): Promise<Message> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .max('timestamp')
    .run()
}

export const getLastMessages = (threadIds: Array<string>): Promise<Object> => {
  return db
    .table('messages')
    .getAll(...threadIds, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .group('threadId')
    .max(row => row('timestamp'))
    .run()
}

// prettier-ignore
export const getMediaMessagesForThread = (threadId: string): Promise<Array<Message>> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter({ messageType: 'media' })
    .filter(db.row.hasFields('deletedAt').not())
    .run()
}

// prettier-ignore
export const storeMessage = (message: Message, userId: string): Promise<Message> => {
  // Insert a message
  return db
    .table('messages')
    .insert(
      Object.assign({}, message, {
        timestamp: new Date(),
        senderId: userId,
        content: {
          body:
            message.messageType === 'media'
              ? message.content.body
              : message.content.body
        }
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(message => {
      if (message.threadType === 'directMessageThread') {
        sendDirectMessageNotificationQueue.add({ message, userId })
      }

      if (message.threadType === 'story') {
        sendMessageNotificationQueue.add({ message })
        setThreadLastActive(message.threadId, message.timestamp)
      }

      return message
    })
}

const getNewMessageChangefeed = () =>
  db
    .table('messages')
    .changes({
      includeInitial: false
    })
    .filter(NEW_DOCUMENTS)('new_val')
    .run()

export const listenToNewMessages = (cb: Function): Function => {
  return createChangefeed(getNewMessageChangefeed, cb, 'listenToNewMessages')
}

export const getMessageCount = (threadId: string): Promise<number> => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .count()
    .run()
}

// prettier-ignore
export const getMessageCountInThreads = (threadIds: Array<string>): Promise<Array<mixed>> => {
  return db
    .table('messages')
    .getAll(...threadIds, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())
    .group('threadId')
    .count()
    .run()
}

export const deleteMessage = (userId: string, messageId: string) => {
  return db
    .table('messages')
    .get(messageId)
    .update(
      {
        deletedBy: userId,
        deletedAt: new Date()
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => result.changes[0].new_val || result.changes[0].old_val)
    .then(message => {
      return message
    })
}

// prettier-ignore
export const deleteMessagesInThread = async (threadId: string, userId: string) => {
  const messages = await db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .run()

  if (!messages || messages.length === 0) return

  const deletePromise = db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .update({
      deletedBy: userId,
      deletedAt: new Date()
    })
    .run()

  return Promise.all([deletePromise])
}

export const userHasMessagesInThread = (threadId: string, userId: string) => {
  return db
    .table('messages')
    .getAll(threadId, { index: 'threadId' })
    .filter(db.row.hasFields('deletedAt').not())('senderId')
    .contains(userId)
    .run()
}
