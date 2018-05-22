// @flow
import type { DBUsersThreads } from '../flowTypes'
import db from '../db'

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