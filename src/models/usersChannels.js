// @flow
import db from '../db'
import type { DBUsersChannels, DBChannel } from '../flowTypes'

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

const createOwnerInChannel = (channelId: string, userId: string): Promise<DBChannel> => {
  // TODO: add track queue
  return db
    .table('usersChannels')
    .insert(
      {
        channelId,
        userId,
        createdAt: new Date(),
        isOwner: true,
        isMember: true,
        isModerator: false,
        isBlocked: false,
        isPending: false,
        receiveNotifications: true
      },
      { returnChanges: true }
    )
    .run()
    .then(result => {
      const join = result.changes[0].new_val
      return db.table('channels').get(join.channelId).run()
    })
}

module.exports = {
  // Modifies
  createOwnerInChannel,
  // GET
  getUsersPermissionsInChannels,
  DEFAULT_USER_CHANNEL_PERMISSIONS
}
