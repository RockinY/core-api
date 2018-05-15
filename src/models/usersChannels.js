// @flow
import db from '../db'
import type { DBUsersChannels } from '../flowTypes'

const DEFAULT_USER_CHANNEL_PERMISSIONS = {
  isOwner: false,
  isMember: false,
  isModerator: false,
  isBlocked: false,
  isPending: false,
  receiveNotifications: false
}

type UserIdAndChannelId = [string, string]

const getUsersPermissionsInChannels = (
  input: Array<UserIdAndChannelId>
): Promise<Array<DBUsersChannels>> => {
  return db
    .table('usersChannels')
    .getAll(...input, { index: 'userIdAndChannelId' })
    .run()
    .then(data => {
      if (!data || data.length === 0) {
        return Array.from({ length: input.length }).map((_, index) => ({
          ...DEFAULT_USER_CHANNEL_PERMISSIONS,
          userId: input[index][0],
          channelId: input[index][1]
        }))
      }

      return data.map((rec, index) => {
        if (rec) {
          return rec
        }

        return {
          ...DEFAULT_USER_CHANNEL_PERMISSIONS,
          userId: input[index][0],
          channelId: input[index][1]
        }
      })
    })
}

module.exports = {
  // GET
  getUsersPermissionsInChannels,
  DEFAULT_USER_CHANNEL_PERMISSIONS
}
