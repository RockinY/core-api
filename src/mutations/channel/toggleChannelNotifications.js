// @flow
import type { GraphQLContext } from '../../flowTypes'
import UserError from '../../utils/userError'
import { toggleUserChannelNotifications } from '../../models/usersChannels'
import { isAuthedResolver as requireAuth } from '../../utils/permissions'

type Input = {
  channelId: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { channelId } = args
  const { user, loaders } = ctx

  const [channel, permissions] = await Promise.all([
    loaders.channel.load(channelId),
    loaders.userPermissionsInChannel.load([user.id, channelId])
  ])

  if (!permissions || permissions.isBlocked || !permissions.isMember) {
    return new UserError("You don't have permission to do that.")
  }

  const value = !permissions.receiveNotifications

  return toggleUserChannelNotifications(user.id, channelId, value).then(
    () => channel
  )
})
