// @flow
import db from '../db'
import type { DBUsersCommunities, DBCommunity } from '../flowTypes'
import { sendCommunityNotificationQueue } from '../utils/bull/queues'

export const createOwnerInCommunity = (communityId: string, userId: string): Promise<Object> => {
  return db
    .table('usersCommunities')
    .insert(
      {
        communityId,
        userId,
        createdAt: new Date(),
        isOwner: true,
        isMember: true,
        isModerator: false,
        isBlocked: false,
        receiveNotifications: true,
        reputation: 0
      },
      { returnChanges: true }
    )
    .run()
    .then(result => {
      sendCommunityNotificationQueue.add({ communityId, userId })
      return result.changes[0].new_val
    })
}

export const createMemberInCommunity = (communityId: string, userId: string): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .run()
    .then(result => {
      if (result && result.length > 0) {
        // if the result exists, it means the user has a previous relationship
        // with this community - since we already handled 'blocked' logic
        // in the mutation controller, we can simply update the user record
        // to be a re-joined member with notifications turned on

        return db
          .table('usersCommunities')
          .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
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
        // if no relationship exists, we can create a new one from scratch
        return db
          .table('usersCommunities')
          .insert(
            {
              communityId,
              userId,
              createdAt: new Date(),
              isMember: true,
              isOwner: false,
              isModerator: false,
              isBlocked: false,
              isPending: false,
              receiveNotifications: true,
              reputation: 0
            },
            { returnChanges: true }
          )
          .run()
      }
    })
    .then(result => {
      return result.changes[0].new_val
    })
}

export const removeMemberInCommunity = (communityId: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId'})
    .update({
      isModerator: false,
      isMember: false,
      receiveNotifications: false
    })
    .run()
    .then(() =>
      db
        .table('communities')
        .get(communityId)
        .run()
    )
}

export const removeMembersInCommunity = async (communityId: string) => {
  const usersCommunities = await db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .run()

  if (!usersCommunities || usersCommunities.length === 0) return

  const leavePromise = await db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .update({
      isMember: false,
      receiveNotifications: false
    })
    .run()

  return Promise.all([
    leavePromise
  ])
}

export const blockUserInCommunity = (communityId: string, userId: string): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId'})
    .update(
      {
        isMember: false,
        isPending: false,
        isBlocked: true,
        isModerator: false,
        receiveNotifications: false
      },
      { returnChanges: true }
    )
    .run()
    .then(result => {
      return result.changes[0].new_val
    })
}

export const unblockUserInCommunity = (communityId: string, userId: string): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .filter({ isBlocked: true })
    .update(
      {
        isModerator: false,
        isMember: true,
        isBlocked: false,
        isPending: false,
        receiveNotifications: true
      },
      { returnChanges: true }
    )
    .run()
    .then(result => {
      return result.changes[0].new_val
    })
}

export const makeMemberModeratorInCommunity = (communityId: string, userId: string): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId'})
    .update(
      {
        isBlocked: false,
        isMember: true,
        isModerator: true,
        receiveNotifications: true
      },
      { returnChanges: true }
    )
    .run()
    .then(result => {
      return result.changes[0].new_val
    })
}

export const removeModeratorInCommunity = (communityId: string, userId: string): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId'})
    .update(
      {
        isModerator: false
      },
      { returnChanges: true }
    )
    .run()
    .then(result => {
      return result.changes[0].new_val
    })
}

export const removeModeratorsInCommunity = async (communityId: string) => {
  const moderators = await db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isModerator: true })
    .run()

  if (!moderators || moderators.length === 0) return

  const removePromise = db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isModerator: true })
    .update({ isModerator: false }, { returnChanges: true })
    .run()

  return Promise.all([removePromise])
}

export const removeUsersCommunityMemberships = async (userId: string) => {
  const memberships = await db
    .table('usersCommunities')
    .getAll(userId, { index: 'userId' })
    .run()

  if (!memberships || memberships.length === 0) return

  const removeMembershipsPromise = db
    .table('usersCommunities')
    .getAll(userId, { index: 'userId' })
    .update({
      isOwner: false,
      isModerator: false,
      isMember: false,
      isPending: false,
      receiveNotifications: false
    })
    .run()

  return Promise.all([removeMembershipsPromise])
}

export const createPendingMemberInCommunity = async (communityId: string, userId: string): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .run()
    .then(result => {
      if (result && result.length > 0) {
        // if the result exists, it means the user has a previous relationship
        // with this community - we handle blocked logic upstream in the mutation,
        // so in this case we can just update the record to be pending

        return db
          .table('usersCommunities')
          .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
          .update(
            {
              createdAt: new Date(),
              isPending: true
            },
            { returnChanges: 'always' }
          )
          .run()
      } else {
        // if no relationship exists, we can create a new one from scratch
        return db
          .table('usersCommunities')
          .insert(
            {
              communityId,
              userId,
              createdAt: new Date(),
              isMember: false,
              isOwner: false,
              isModerator: false,
              isBlocked: false,
              isPending: true,
              receiveNotifications: true,
              reputation: 0
            },
            { returnChanges: true }
          )
          .run()
      }
    })
    .then(result => {
      // TODO@PRIVATE_COMMUNITIES
      // add queue for sending notification to community owner

      return result.changes[0].new_val
    })
}

export const removePendingMemberInCommunity = async (communityId: string, userId: string): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId'})
    .update({
      isPending: false
    })
    .run()
}

export const approvePendingMemberInCommunity = async (
  communityId: string,
  userId: string
): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .update(
      {
        isMember: true,
        isPending: false,
        receiveNotifications: true
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      return result.changes[0].new_val
    })
}

export const blockPendingMemberInCommunity = async (
  communityId: string,
  userId: string
): Promise<DBUsersCommunities> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .update(
      {
        isPending: false,
        isBlocked: true
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      return result.changes[0].new_val
    })
}

type Options = { first: number, after: number }

export const getMembersInCommunity = (communityId: string, options: Options, filter: Object): Promise<Array<string>> => {
  const { first, after } = options
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter(filter || { isMember: true })
    .orderBy(db.desc('reputation'))
    .skip(after || 0)
    .limit(first || 999999)
    // return an array of the userIds to be loaded by gql
    .map(userCommunity => userCommunity('userId'))
    .run()
}

export const getBlockedUsersInCommunity = (communityId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll(communityId, { index: 'communityId' })
      .filter({ isBlocked: true })
      // return an array of the userIds to be loaded by gql
      .map(userCommunity => userCommunity('userId'))
      .run()
  )
}

export const getPendingUsersInCommunity = (communityId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll(communityId, { index: 'communityId' })
      .filter({ isPending: true })
      // return an array of the userIds to be loaded by gql
      .map(userCommunity => userCommunity('userId'))
      .run()
  )
}

export const getModeratorsInCommunity = (communityId: string): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll(communityId, { index: 'communityId' })
      .filter({ isModerator: true })
      // return an array of the userIds to be loaded by gql
      .map(userCommunity => userCommunity('userId'))
      .run()
  )
}

export const getOwnersInCommunity = (
  communityId: string
): Promise<Array<string>> => {
  return (
    db
      .table('usersCommunities')
      .getAll(communityId, { index: 'communityId' })
      .filter({ isOwner: true })
      // return an array of the userIds to be loaded by gql
      .map(userCommunity => userCommunity('userId'))
      .run()
  )
}

export const DEFAULT_USER_COMMUNITY_PERMISSIONS = {
  isOwner: false,
  isMember: false,
  isModerator: false,
  isBlocked: false,
  receiveNotifications: false,
  reputation: 0
}

type UserIdAndCommunityId = [string, string]

export const getUserPermissionsInCommunity = (communityId: string, userId: string): Promise<Object> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], {
      index: 'userIdAndCommunityId'
    })
    .run()
    .then(data => {
      // if a record exists
      if (data.length > 0) {
        return data[0]
      } else {
        // if a record doesn't exist, we're creating a new relationship
        // so default to false for everything
        return {
          ...DEFAULT_USER_COMMUNITY_PERMISSIONS,
          userId,
          communityId
        }
      }
    })
}

export const getUsersPermissionsInCommunities = (input: Array<UserIdAndCommunityId>) => {
  return db
    .table('usersCommunities')
    .getAll(...input, { index: 'userIdAndCommunityId' })
    .run()
    .then(data => {
      if (!data) {
        return Array.from({ length: input.length }, (_, index) => ({
          ...DEFAULT_USER_COMMUNITY_PERMISSIONS,
          userId: input[index][0],
          communityId: input[index][1]
        }))
      }

      return data.map((rec, index) => {
        if (rec) {
          return rec
        }
        return {
          ...DEFAULT_USER_COMMUNITY_PERMISSIONS,
          userId: input[index][0],
          communityId: input[index][1]
        }
      })
    })
}

export const checkUserPermissionsInCommunity = (communityId: string, userId: string): Promise<Array<DBUsersCommunities>> => {
  return db
    .table('usersCommunities')
    .getAll([userId, communityId], { index: 'userIdAndCommunityId' })
    .run()
}

export const getReputationByUser = (userId: string): Promise<Number> => {
  return db
    .table('usersCommunities')
    .getAll(userId, { index: 'userId' })
    .filter({ isMember: true })
    .map(rec => rec('reputation'))
    .reduce((l, r) => l.add(r))
    .default(0)
    .run()
}

export const getUsersTotalReputation = (userIds: Array<string>): Promise<Array<number>> => {
  return db
    .table('usersCommunities')
    .getAll(...userIds, { index: 'userId' })
    .filter({ isMember: true })
    .group('userId')
    .map(rec => rec('reputation'))
    .reduce((l, r) => l.add(r))
    .default(0)
    .run()
    .then(res =>
      res.map(
        res =>
          res && {
            reputation: res.reduction,
            userId: res.group
          }
      )
    )
}
