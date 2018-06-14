// @flow
import type { DBCommunity, GraphQLContext } from '../../flowTypes'
import { canViewCommunity } from '../../utils/permissions'

export default async (root: DBCommunity, _: any, ctx: GraphQLContext) => {
  const { user, loaders } = ctx
  const { id } = root

  if (!await canViewCommunity(user, id, loaders)) {
    return {
      channels: 0,
      members: 0
    }
  }

  const [channelCount, memberCount] = await Promise.all([
    loaders.communityChannelCount.load(id),
    loaders.communityMemberCount.load(id)
  ])

  return {
    channels: channelCount ? channelCount.reduction : 0,
    members: memberCount ? memberCount.reduction : 0
  }
}
