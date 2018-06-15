// @flow
import type { GraphQLContext, DBThread } from '../../flowTypes'

export default (
  { id }: DBThread,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!user || !user.id) return null

  return loaders.userThreadNotificationStatus
    .load([user.id, id])
    .then(result => {
      if (!result || result.length === 0) return
      const data = result
      if (!data || !data.lastSeen) return null

      return data.lastSeen
    })
}
