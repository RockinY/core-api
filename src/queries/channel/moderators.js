import type { GraphQLContext, DBChannel } from '../../flowTypes'
import { getModeratorsInChannel } from '../../models/usersChannels'

export default (
  { id }: DBChannel,
  _: any,
  { loaders }: GraphQLContext
) => {
  return getModeratorsInChannel(id)
    .then(users => loaders.user.loadMany(users))
}
