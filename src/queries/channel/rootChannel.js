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
  if (args.id) {
    return await loaders.channel.load(args.id)
  }
  if (args.channelSlug && args.communitySlug) {
    return await getChannelBySlug(args.channelSlug, args.communitySlug)
  }
  return new UserError("We couldn't find this channel")
}
