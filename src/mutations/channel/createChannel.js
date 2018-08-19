// @flow
import type { GraphQLContext } from '../../flowTypes'
import type { CreateChannelInput } from '../../models/channel'
import UserError from '../../utils/userError'
import { getChannelBySlug, createChannel } from '../../models/channel'
import { createOwnerInChannel } from '../../models/usersChannels'
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
  channelSlugIsBlacklisted,
  isProUser
} from '../../utils/permissions'

export default requireAuth(
  async (_: any, args: CreateChannelInput, ctx: GraphQLContext) => {
    const { user, loaders } = ctx

    const community = await loaders.community.load(args.input.communityId)

    if (!await canModerateCommunity(user.id, args.input.communityId, loaders)) {
      // TODO: track queue
      return new UserError(
        'You don’t have permission to create channels in this community'
      )
    }

    if (channelSlugIsBlacklisted(args.input.slug)) {
      // TODO: track queue
      return new UserError(
        'This channel url is reserved - please try another name'
      )
    }

    const channelWithSlug = await getChannelBySlug(
      args.input.slug,
      community.slug
    )

    if (channelWithSlug) {
      // TODO: track queue
      return new UserError(
        'A channel with this url already exists in this community - please try another name'
      )
    }

    // check user permissions
    if (args.input.isPrivate && !(await isProUser(user))) {
      return new UserError('Permission denied.')
    }

    const newChannel = await createChannel(args, user.id)

    return createOwnerInChannel(newChannel.id, user.id).then(
      () => newChannel
    )
  }
)
