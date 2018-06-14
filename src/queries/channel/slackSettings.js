// @flow
import type { GraphQLContext, DBChannel } from '../../flowTypes'
import UserError from '../../utils/UserError'
import {
  canModerateChannel,
  isAuthedResolver as requireAuth
} from '../../utils/permissions'

export default requireAuth(
  async ({ id }: DBChannel, _: any, { loaders, user }: GraphQLContext) => {
    if (!await canModerateChannel(user.id, id, loaders)) {
      return new UserError('You don’t have permission to manage this channel')
    }

    return loaders.channelSettings.load(id)
  }
)
