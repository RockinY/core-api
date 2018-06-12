// @flow
import type { GraphQLContext } from '../../flowTypes'
import type { GetChannelArgs } from '../../models/channel'
import UserError from '../../utils/userError'
import { getChannelBySlug } from '../../models/channel'

export default async (
  _: any,
  args: GetChannelArgs,
  { loaders }: GraphQLContext
) => {
  if (typeof args.id === 'string') {
    return loaders.channel.load(args.id)
  }
  if (typeof args.channelSlug === 'string' && typeof args.communitySlug === 'string') {
    return getChannelBySlug(args.channelSlug, args.communitySlug)
  }
  return new UserError("We couldn't find this channel")
}
