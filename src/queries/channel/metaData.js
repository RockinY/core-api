// @flow
import type { GraphQLContext, DBChannel } from '../../flowTypes'

export default async (
  { id }: DBChannel,
  _: any,
  { loaders }: GraphQLContext
) => {
  const [threads, members] = await Promise.all([
    loaders.channelThreadCount.load(id),
    loaders.channelMemberCount.load(id)
  ])

  return {
    threads: threads ? threads.reduction : 0,
    members: members ? members.reduction : 0
  }
}
