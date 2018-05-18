// @flow
import type { DBReaction, GraphQLContext } from '../../flowTypes'

export default (
  { userId }: DBReaction,
  _: any,
  { loaders }: GraphQLContext
) => {
  return loaders.user.load(userId)
}
