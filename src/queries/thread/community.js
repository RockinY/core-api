// @flow
import type { GraphQLContext, DBThread } from '../../flowTypes'

export default (
  { communityId }: DBThread,
  _: any,
  { loaders }: GraphQLContext
) => loaders.community.load(communityId)
