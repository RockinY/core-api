// @flow
import db from '../db'

const createNewUsersSettings = (userId: string): Promise<Object> => {
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

module.exports = {
  createNewUsersSettings
}
