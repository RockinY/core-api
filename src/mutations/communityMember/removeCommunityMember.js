// @flow
import type { GraphQLContext } from '../../flowTypes'
import UserError from '../../utils/userError'
import { getCommunityById } from '../../models/community'
import {
  removeMemberInCommunity,
  checkUserPermissionsInCommunity
} from '../../models/usersCommunities'
import { removeMemberInChannel } from '../../models/usersChannels'
import { getChannelsByUserAndCommunity } from '../../models/channel'
import { isAuthedResolver as requireAuth } from '../../utils/permissions'

type Input = {
  input: {
    communityId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { communityId } = args.input
  const { user } = ctx

  const [permissions, community] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, user.id),
    getCommunityById(communityId)
  ])

  if (!community) {
    return new UserError("We couldn't find that community.")
  }

  if (!permissions || permissions.length === 0) {
    return new UserError("You're not a member of this community.")
  }

  const permission = permissions[0]

  // they've already left the community
  if (!permission.isMember) {
    return new UserError("You're not a member of this community.")
  }

  // in theory this should only get triggered if someone is trying to manually
  // send graphql queries; blocked users should never see controls in a community
  // anyways, but we protect this regardless because we want to retain the
  // usersCommunities record forever that indicates this user is blocked
  if (permission.isBlocked) {
    return new UserError("You aren't able to leave this community.")
  }

  if (permission.isOwner) {
    return new UserError('Community owners cannot leave their own community.')
  }

  // account for both moderators or members leaving a community
  if (permission.isMember || permission.isModerator) {
    const allChannelsInCommunity = await getChannelsByUserAndCommunity(
      communityId,
      user.id
    )
    const leaveChannelsPromises = allChannelsInCommunity.map(channel =>
      removeMemberInChannel(channel, user.id)
    )

    return await Promise.all([
      removeMemberInCommunity(communityId, user.id),
      ...leaveChannelsPromises
    ]).then(() => community)
  }

  return new UserError(
    "We weren't able to process your request to leave this community."
  )
})
