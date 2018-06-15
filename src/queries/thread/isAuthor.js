// @flow
import type { GraphQLContext, DBThread } from '../../flowTypes'

export default ({ creatorId }: DBThread, _: any, { user }: GraphQLContext) => {
  if (!creatorId || !user) return false
  return user.id === creatorId
}
