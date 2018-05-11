// @flow
import db from '../db'

export const createNewUsersSettings = (userId: string): Promise<Object> => {
  return db.table('usersSettings').insert({
    userId,
    notifications: {
      types: {
        newMessageInThreads: {
          email: true
        },
        newMention: {
          email: true
        },
        newDirectMessage: {
          email: true
        },
        newThreadCreated: {
          email: true
        },
        dailyDigest: {
          email: true
        },
        weeklyDigest: {
          email: true
        }
      }
    }
  })
}

export const getUsersSettings = (userId: string): Promise<Object> => {
  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .run()
    .then(results => {
      if (results && results.length > 0) {
        return results[0]
      }
    })
}
