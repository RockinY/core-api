// @flow
import type { GraphQLContext } from '../../flowTypes'

type GetCommunityMemberArgs = {
  userId: string,
  communityId: string,
};

export default (
  _: any,
  args: GetCommunityMemberArgs,
  { loaders }: GraphQLContext
) => loaders.userPermissionsInCommunity.load([args.userId, args.communityId])
