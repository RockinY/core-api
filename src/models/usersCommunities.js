// @flow
import db from '../db'

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
      // TODO: Add track queue
      return result.changes[0].new_val
    })
}

const DEFAULT_USER_COMMUNITY_PERMISSIONS = {
  isOwner: false,
  isMember: false,
  isModerator: false,
  isBlocked: false,
  receiveNotifications: false,
  reputation: 0
}

type UserIdAndCommunityId = [string, string]

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
