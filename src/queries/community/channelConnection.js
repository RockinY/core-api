import { DBCommunity, GraphQLContext } from '../../flowTypes'
import { getChannelsByCommunity } from '../../models/channel'
import { canViewCommunity } from '../../utils/permissions'

export default async (
  { id }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!await canViewCommunity(user, id, loaders)) {
    return {
      pageInfo: {
        hasNextPage: false
      },
      edges: []
    }
  }

  return {
    pageInfo: {
      hasNextPage: false
    },
    edges: getChannelsByCommunity(id).then(channels => {
      return channels.map(channel => ({
        node: channel
      }))
    })
  }

}