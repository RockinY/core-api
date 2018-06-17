// @flow
import type { GraphQLContext } from '../../flowTypes'
import UserError from '../../utils/userError'
import {
  getOrCreateChannelSettings,
  disableChannelTokenJoin
} from '../../models/channelSettings'
import {
  isAuthedResolver as requireAuth,
  canModerateChannel
} from '../../utils/permissions'

type Input = {
  input: {
    id: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { id: channelId } = args.input
  const { user, loaders } = ctx

  if (!await canModerateChannel(user.id, channelId, loaders)) {
    return new UserError('You don’t have permission to manage this channel')
  }

  return await getOrCreateChannelSettings(channelId).then(
    async () => await disableChannelTokenJoin(channelId, user.id)
  )
})
