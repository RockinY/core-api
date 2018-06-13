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

const getUserPermissionsInChannel = (channelId: string, userId: string): Promise<DBUsersChannels> => {
  return db
    .table('usersChannels')
    .getAll([userId, channelId], { index: 'userIdAndChannelId' })
    .run()
    .then(data => {
      // if a record exists
      if (data.length > 0) {
        return data[0]
      } else {
        // if a record doesn't exist, we're creating a new relationship
        // so default to false for everything
        return DEFAULT_USER_CHANNEL_PERMISSIONS
      }
    })
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

const createMemberInChannel = (channelId: string, userId: string, token: boolean): Promise<DBChannel> => {
  return db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .filter({ channelId })
    .run()
    .then(result => {
      if (result && result.length > 0) {
        return db
          .table('usersChannels')
          .getAll(userId, { index: 'userId' })
          .filter({ channelId, isBlocked: false })
          .update(
            {
              createdAt: new Date(),
              isMember: true,
              receiveNotifications: true
            },
            { returnChanges: 'always' }
          )
          .run()
      } else {
        return db
          .table('usersChannels')
          .insert(
            {
              channelId,
              userId,
              createdAt: new Date(),
              isMember: true,
              isOwner: false,
              isModerator: false,
              isBlocked: false,
              isPending: false,
              receiveNotifications: true
            },
            { returnChanges: true }
          )
          .run()
      }
    })
    .then(() => db.table('channels').get(channelId))
}

const removeMemberInChannel = (channelId: string, userId: string): Promise<?DBChannel> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ userId })
    .update(
      {
        isModerator: false,
        isMember: false,
        isPending: false,
        receiveNotifications: false
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      if (result && result.changes && result.changes.length > 0) {
        const join = result.changes[0].old_val
        return db.table('channels').get(join.channelId).run()
      } else {
        return null
      }
    })
}

const unblockMemberInChannel = (channelId: string, userId: string): Promise<?DBChannel> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ userId })
    .update(
      {
        isBlocked: false
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      if (result && result.changes && result.changes.length > 0) {
        return db.table('channels').get(channelId)
      } else {

      }
    })
}

const removeMembersInChannel = (channelId: string): Promise<Array<?DBUsersChannels>> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .update({
      isMember: false,
      receiveNotifications: false
    })
    .run()
}

const createOrUpdatePendingUserInChannel = (channelId: string, userId: string): Promise<DBChannel> => {
  return db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .filter({ channelId })
    .run()
    .then(data => {
      if (data && data.length > 0) {
        return db
          .table('usersChannels')
          .getAll(channelId, { index: 'channelId' })
          .filter({ userId })
          .update(
            {
              isPending: true
            },
            { returnChanges: true }
          )
          .run()
      } else {
        return db
          .table('usersChannels')
          .insert(
            {
              channelId,
              userId,
              createdAt: new Date(),
              isMember: false,
              isOwner: false,
              isModerator: false,
              isBlocked: false,
              isPending: true,
              receiveNotifications: false
            },
            { returnChanges: true }
          )
          .run()
      }
    })
    .then(() => {
      return db.table('channels').get(channelId)
    })
}

const removePendingUsersInChannel = (channelId: string): Promise<DBChannel> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ isPending: true })
    .update({
      isPending: false,
      receiveNotifications: false
    })
    .run()
    .then(result => {
      const join = result.changes[0].new_val
      return db.table('channels').get(join.channelId)
    })
}

const blockUserInChannel = (channelId: string, userId: string): Promise<DBUsersChannels> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ userId })
    .update(
      {
        isMember: false,
        isPending: false,
        isBlocked: true,
        receiveNotifications: false
      },
      { returnChanges: true }
    )
    .run()
}

const approvePendingUserInChannel = (channelId: string, userId: string): Promise<DBUsersChannels> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ userId })
    .update(
      {
        isMember: true,
        isPending: false,
        receiveNotifications: true
      },
      { returnChanges: true }
    )
    .run()
    .then(() => {
      return db.table('channels').get(channelId)
    })
}

const approvePendingUsersInChannel = (channelId: string): Promise<DBUsersChannels> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ isPending: true })
    .update(
      {
        isMember: true,
        isPending: false,
        receiveNotifications: true
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
}

const approveBlockedUserInChannel = (channelId: string, userId: string): Promise<DBUsersChannels> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ userId, isBlocked: true })
    .update(
      {
        isMember: true,
        isBlocked: false,
        receiveNotifications: false
      },
      { returnChanges: true }
    )
    .run()
}

const createModeratorInChannel = (channelId: string, userId: string): Promise<DBUsersChannels> => {
  return db
    .table('usersChannels')
    .insert(
      {
        channelId,
        userId,
        createdAt: new Date(),
        isMember: true,
        isOwner: false,
        isModerator: true,
        isBlocked: false,
        isPending: false,
        receiveNotifications: true
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
}

const makeMemberModeratorInChannel = (channelId: string, userId: string): Promise<DBUsersChannels> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ userId })
    .update(
      {
        isMember: true,
        isBlocked: false,
        isModerator: true,
        receiveNotifications: true
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
}

const removeModeratorInChannel = (
  channelId: string,
  userId: string
): Promise<DBUsersChannels> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ userId })
    .update({
      isModerator: false
    })
    .run()
}

const createMemberInDefaultChannels = (communityId: string, userId: string): Promise<Array<Object>> => {
  // get the default channels for the community being joined
  const defaultChannels = db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isDefault: true })
    .run()

  // get the current user's relationships to all channels

  const usersChannels = db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .run()

  return Promise.all([defaultChannels, usersChannels]).then(
    ([defaultChannels, usersChannels]) => {
      // convert default channels and users channels to arrays of ids
      // to efficiently filter down to find the default channels that exist
      // which a user has not joined
      const defaultChannelIds = defaultChannels.map(channel => channel.id)
      const usersChannelIds = usersChannels.map(e => e.channelId)

      // returns a list of Ids that represent channels which are defaults
      // in the community but the user has no relationship with yet
      const defaultChannelsTheUserHasNotJoined = defaultChannelIds.filter(
        channelId => usersChannelIds.indexOf(channelId) >= -1
      )

      // create all the necessary relationships
      return Promise.all(
        defaultChannelsTheUserHasNotJoined.map(channel =>
          createMemberInChannel(channel, userId, false)
        )
      )
    }
  )
}

const toggleUserChannelNotifications = (userId: string, channelId: string, value: boolean): Promise<DBChannel> => {
  return db
    .table('usersChannels')
    .getAll(channelId, { index: 'channelId' })
    .filter({ userId })
    .update({ receiveNotifications: value })
    .run()
}

const removeUsersChannelMemberships = async (userId: string) => {
  const usersChannels = await db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .run()

  if (!usersChannels || usersChannels.length === 0) return

  const channelPromise = db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .update({
      isOwner: false,
      isModerator: false,
      isMember: false,
      receiveNotifications: false
    })
    .run()

  return Promise.all([channelPromise])
}

type Options = { first: number, after: number }

const getMembersInChannel = (channelId: string, options: Options): Promise<Array<string>> => {
  const { first, after } = options

  return (
    db
      .table('usersChannels')
      .getAll(channelId, { index: 'channelId' })
      .filter({ isMember: true })
      .skip(after || 0)
      .limit(first || 999999)
      // return an array of the userIds to be loaded by gql
      .map(userChannel => userChannel('userId'))
      .run()
  )
}

const getPendingUsersInChannel = (channelId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersChannels')
      .getAll(channelId, { index: 'channelId' })
      .filter({ isPending: true })
      // return an array of the userIds to be loaded by gql
      .map(userChannel => userChannel('userId'))
      .run()
  )
}

const getPendingUsersInChannels = (channelIds: Array<string>) => {
  return db
    .table('usersChannels')
    .getAll(...channelIds, { index: 'channelId' })
    .group('channelId')
    .filter({ isPending: true })
    .run()
}

const getBlockedUsersInChannel = (channelId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersChannels')
      .getAll(channelId, { index: 'channelId' })
      .filter({ isBlocked: true })
      // return an array of the userIds to be loaded by gql
      .map(userChannel => userChannel('userId'))
      .run()
  )
}

const getModeratorsInChannel = (channelId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersChannels')
      .getAll(channelId, { index: 'channelId' })
      .filter({ isModerator: true })
      // return an array of the userIds to be loaded by gql
      .map(userChannel => userChannel('userId'))
      .run()
  )
}

const getOwnersInChannel = (channelId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersChannels')
      .getAll(channelId, { index: 'channelId' })
      .filter({ isOwner: true })
      // return an array of the userIds to be loaded by gql
      .map(userChannel => userChannel('userId'))
      .run()
  )
}

const getUserUsersChannels = (userId: string) => {
  return db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .filter({ isMember: true })
    .run()
}

module.exports = {
  // modify and create
  createOwnerInChannel,
  createMemberInChannel,
  removeMemberInChannel,
  unblockMemberInChannel,
  removeMembersInChannel,
  createOrUpdatePendingUserInChannel,
  removePendingUsersInChannel,
  blockUserInChannel,
  approvePendingUserInChannel,
  approvePendingUsersInChannel,
  approveBlockedUserInChannel,
  createModeratorInChannel,
  makeMemberModeratorInChannel,
  removeModeratorInChannel,
  createMemberInDefaultChannels,
  toggleUserChannelNotifications,
  removeUsersChannelMemberships,
  // get
  getMembersInChannel,
  getPendingUsersInChannel,
  getBlockedUsersInChannel,
  getModeratorsInChannel,
  getOwnersInChannel,
  getUserPermissionsInChannel,
  getUsersPermissionsInChannels,
  getPendingUsersInChannels,
  getUserUsersChannels,
  // constants
  DEFAULT_USER_CHANNEL_PERMISSIONS
}
