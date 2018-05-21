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
