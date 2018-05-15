// @flow
import type { GraphQLContext } from '../../flowTypes'

export default async (
  _: any,
  { id }: { id: string },
  { loaders, user }: GraphQLContext
) => {
  const thread = await loaders.thread.load(id)

  if (!thread) {
    return null
  }

  if (!user) {
    const channel = await loaders.channel.load(thread.channelId)

    if (channel.isPrivate) {
      return null
    }
    return thread
  } else {
    const [permissions, channel] = await Promise.all([
      loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
      loaders.channel.load(thread.channelId)
    ])

    if (channel.isPrivate && !permissions.isMember) {
      return null
    }
    return thread
  }
}
