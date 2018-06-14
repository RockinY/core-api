import type { GraphQLContext } from '../../flowTypes'

export default (
  { communityId }: { communityId: string },
  _: any,
  { loaders }: GraphQLContext
) => loaders.community.load(communityId)
