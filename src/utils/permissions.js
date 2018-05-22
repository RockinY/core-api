// @flow
import {
  COMMUNITY_SLUG_BLACKLIST,
  CHANNEL_SLUG_BLACKLIST
} from './slugBlacklists'
import type { GraphQLContext, DBCommunity } from '../flowTypes'
import UserError from '../utils/userError'

export const communitySlugIsBlacklisted = (slug: string): boolean => {
  return COMMUNITY_SLUG_BLACKLIST.indexOf(slug) > -1
}

export const channelSlugIsBlacklisted = (slug: string): boolean => {
  return CHANNEL_SLUG_BLACKLIST.indexOf(slug) > -1
}

export const isAuthedResolver = (
  resolver: Function
) => (obj: any, args: any, context: GraphQLContext, info: any) => {
  if (!context.user || !context.user.id) {
    return new UserError('You must be signed in to do this')
  }

  return resolver(obj, args, context, info)
}

const communityExists = async (
  communityId: string,
  loaders: any
): Promise<?DBCommunity> => {
  const community = await loaders.community.load(communityId)
  if (!community || community.deletedAt) {
    return null
  }
  return community
}

export const canModerateCommunity = async (
  userId: string,
  communityId: string,
  loaders: any
) => {
  if (!userId || !communityId) {
    return false
  }
  const community = await communityExists(communityId, loaders)
  if (!community) {
    return false
  }
  const communityPermissions = await loaders.userPermissionsInCommunity.load([
    userId,
    communityId
  ])
  if (!communityPermissions) {
    return false
  }
  if (communityPermissions.isOwner || communityPermissions.isModerator) {
    return true
  }
  return false
}
