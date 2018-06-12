// @flow
import db from '../db'
import type { DBThread, FileUpload } from '../flowTypes'
import { NEW_DOCUMENTS, parseRange } from './utils'
import { createChangefeed } from '../utils/changeFeed'
import { deleteMessagesInThread } from './message'
import { turnOffAllThreadNotifications } from './usersThreads'

export const getThreads = (
  threadIds: Array<string>
): Promise<Array<DBThread>> => {
  return db
    .table('threads')
    .getAll(...threadIds)
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run()
}

export const getThreadsByUserAsSpamCheck = (
  userId: string,
  timeframe: number = 60 * 10
): Promise<Array<?DBThread>> => {
  return db
    .table('threads')
    .getAll(userId, { index: 'creatorId' })
    .filter(db.row('createdAt').during(db.now().sub(timeframe), db.now()))
    .run()
}

export const publishThread = (
  { filesToUpload, ...thread }: Object,
  userId: string
): Promise<DBThread> => {
  return db
    .table('threads')
    .insert(
      Object.assign({}, thread, {
        creatorId: userId,
        createdAt: new Date(),
        lastActive: new Date(),
        modifiedAt: null,
        isPublished: true,
        isLocked: false,
        edits: []
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => {
      const thread = result.changes[0].new_val
      // TODO: track queue
      return thread
    })
}

type File = FileUpload

type Attachment = {
  attachmentType: string,
  data: string
}

export type EditThreadInput = {
  threadId: string,
  content: {
    title: string,
    body: ?string
  },
  attachments?: ?Array<Attachment>,
  filesToUpload?: ?Array<File>
}

export const editThread = (
  input: EditThreadInput,
  userId: string,
  shouldUpdate: boolean = true
): Promise<DBThread> => {
  return db
    .table('threads')
    .get(input.threadId)
    .update(
      {
        content: input.content,
        attachments: input.attachments,
        modifiedAt: shouldUpdate ? new Date() : null,
        edits: db.row('edits').append({
          content: db.row('content'),
          attachments: db.row('attachments'),
          timestamp: new Date()
        })
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      if (result.replaced === 1) {
        const thread = result.changes[0].new_val
        return thread
      }

      return result.changes[0].old_val
    })
}

export const setThreadLastActive = (threadId: string, value: Date) => {
  return db
    .table('threads')
    .get(threadId)
    .update({ lastActive: value })
    .run()
}
