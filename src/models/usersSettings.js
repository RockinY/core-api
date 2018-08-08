// @flow
import db from '../db'

export const createNewUsersSettings = (userId: string): Promise<Object> => {
  return db.table('usersSettings').insert({
    userId,
    notifications: {
      types: {
        newMessageInThreads: {
          email: false
        },
        newMention: {
          email: false
        },
        newDirectMessage: {
          email: false
        },
        newThreadCreated: {
          email: false
        },
        dailyDigest: {
          email: false
        },
        weeklyDigest: {
          email: false
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

export const updateUsersNotificationSettings = (userId: string, settings: Object, type: string, method: string, enabled: string): Promise<Object> => {
  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .update({
      ...settings
    })
    .run()
}

export const unsubscribeUserFromEmailNotification = (userId: string, type: string): Promise<Object> => {
  const obj = { notifications: { types: {} } }
  obj['notifications']['types'][type] = { email: false }

  return db
    .table('usersSettings')
    .getAll(userId, { index: 'userId' })
    .update({ ...obj })
    .run()
}
