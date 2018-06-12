// @flow
import db from '../db'
import type { DBUsersThreads } from '../flowTypes'

export const createParticipantInThread = (
  threadId: string,
  userId: string
): Promise<Object> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .run()
    .then(result => {
      if (result && result.length > 0) {
        const { id, isParticipant, receiveNotifications } = result[0]
        if (isParticipant) {
          return
        }

        // TODO: notification track queue

        return db
          .table('usersThreads')
          .get(id)
          .update({
            isParticipant: true,
            receiveNotifications: !(receiveNotifications === false)
          })
          .run()
      } else {
        // TODO: track queue
        return db
          .table('usersThreads')
          .insert({
            createdAt: new Date(),
            userId,
            threadId,
            isParticipant: true,
            receiveNotifications: true
          })
      }
    })
}

export const deleteParticipantInThread = (threadId: string, userId: string): Promise<boolean> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .delete()
    .run()
}

// Users can opt in to notifications on a thread without having to leave a message or be the thread creator. This will only activate notifications and the user will not appear as a participant in the UI
// prettier-ignore
export const createNotifiedUserInThread = (threadId: string, userId: string): Promise<Object> => {
  return db
    .table('usersThreads')
    .insert({
      createdAt: new Date(),
      userId,
      threadId,
      isParticipant: false,
      receiveNotifications: true
    })
    .run()
}

// prettier-ignore
export const getParticipantsInThread = (threadId: string): Promise<Array<Object>> => {
  return db
    .table('usersThreads')
    .getAll(threadId, { index: 'threadId' })
    .filter({ isParticipant: true })
    .eqJoin('userId', db.table('users'))
    .without({
      left: ['createdAt', 'id', 'threadId', 'userId']
    })
    .zip()
    .run()
}

export const getParticipantsInThreads = (threadIds: Array<string>) => {
  return db
    .table('usersThreads')
    .getAll(...threadIds, { index: 'threadId' })
    .filter({ isParticipant: true })
    .eqJoin('userId', db.table('users'))
    .group(rec => rec('left')('threadId'))
    .without({
      left: ['createdAt', 'id', 'userId']
    })
    .zip()
    .run()
}

// prettier-ignore
export const getThreadNotificationStatusForUser = (threadId: string, userId: string): Promise<?DBUsersThreads> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .run()
    .then(results => {
      if (!results || results.length === 0) return null
      return results[0]
    })
}

type UserIdAndThreadId = [string, string];

// prettier-ignore
export const getThreadsNotificationStatusForUsers = (input: Array<UserIdAndThreadId>) => {
  return db
    .table('usersThreads')
    .getAll(...input, { index: 'userIdAndThreadId' })
    .run()
    .then(result => {
      if (!result) return Array.from({ length: input.length }).map(() => null)

      return result
    })
}

// prettier-ignore
export const updateThreadNotificationStatusForUser = (threadId: string, userId: string, value: boolean): Promise<Object> => {
  return db
    .table('usersThreads')
    .getAll([userId, threadId], { index: 'userIdAndThreadId' })
    .run()
    .then(results => {
      // if no record exists, the user is trying to mute a thread they
      // aren't a member of - e.g. someone mentioned them in a thread
      // so create a record

      if (!results || results.length === 0) {
        return db.table('usersThreads').insert({
          createdAt: new Date(),
          userId,
          threadId,
          isParticipant: false,
          receiveNotifications: value
        })
          .run()
      }

      const record = results[0]
      return db
        .table('usersThreads')
        .get(record.id)
        .update({
          receiveNotifications: value
        })
        .run()
    })
}

// when a thread is deleted, we make sure all relationships to that thread have notifications turned off
// prettier-ignore
export const turnOffAllThreadNotifications = (threadId: string): Promise<Object> => {
  return db
    .table('usersThreads')
    .getAll(threadId, { index: 'threadId' })
    .update({
      receiveNotifications: false
    })
    .run()
}

export const disableAllThreadNotificationsForUser = (userId: string) => {
  return db
    .table('usersThreads')
    .getAll(userId, { index: 'userId' })
    .update({
      receiveNotifications: false
    })
    .run()
}
