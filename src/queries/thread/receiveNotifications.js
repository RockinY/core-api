// @flow
import type { GraphQLContext, DBThread } from '../../flowTypes'

export default (
  { id }: DBThread,
  __: any,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user
  if (!currentUser) {
    return false
  } else {
    return loaders.userThreadNotificationStatus
      .load([currentUser.id, id])
      .then(result => (result ? result.receiveNotifications : false))
  }
}
