import type { GraphQLContext, DBChannel } from '../../flowTypes'
import { getOwnersInChannel } from '../../models/usersChannels'

export default ({ id }: DBChannel, _: any, { loaders }: GraphQLContext) => {
  return getOwnersInChannel(id).then(users => loaders.user.loadMany(users))
}
