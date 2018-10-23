// @flow
import {
  COMMUNITY_SLUG_BLACKLIST,
  CHANNEL_SLUG_BLACKLIST
} from './slugBlacklists'
import type { GraphQLContext, DBCommunity, DBChannel, DBUser } from '../flowTypes'
import UserError from '../utils/userError'
import { getMemberSubscriptionsByuserId } from '../models/memberSubscription'
import dayjs from 'dayjs'

const admin_ids = process.env.ADMIN_IDS || ''

export const isAdmin = (id: string): boolean => {
  const admins = admin_ids.split(',')
  return admins.indexOf(id) > -1
}

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

const channelExists = async (channelId: string, loaders: any): Promise<?DBChannel> => {
  const channel = await loaders.channel.load(channelId)
  if (!channel || channel.deletedAt) return null
  return channel
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

export const isProUser = async (user: DBUser): Promise<boolean> => {
  const userSubscriptions = await getMemberSubscriptionsByuserId(user.id)
  const latestSubscription = userSubscriptions[0]
  if (latestSubscription && dayjs(latestSubscription.endAt).isAfter(dayjs())) {
    return true
  }
  return false
}

export const canAdministerChannel = async (userId: string, channelId: string, loaders: any) => {
  if (!userId || !channelId) return false

  const channel = await channelExists(channelId, loaders)
  if (!channel) return false

  const [communityPermissions, channelPermissions] = await Promise.all([
    loaders.userPermissionsInCommunity.load([userId, channel.communityId]),
    loaders.userPermissionsInChannel.load([userId, channelId])
  ])

  if (!communityPermissions) return false
  if (communityPermissions.isOwner || communityPermissions.isModerator) { return true }
  if (!channelPermissions) return false
  if (channelPermissions.isOwner) return true

  return false
}

export const canModerateChannel = async (userId: string, channelId: string, loaders: any) => {
  if (!userId || !channelId) return false

  const channel = await channelExists(channelId, loaders)
  if (!channel) return false

  const [communityPermissions, channelPermissions] = await Promise.all([
    loaders.userPermissionsInCommunity.load([userId, channel.communityId]),
    loaders.userPermissionsInChannel.load([userId, channelId])
  ])

  if (!communityPermissions) return false
  if (communityPermissions.isOwner || communityPermissions.isModerator) { return true }
  if (!channelPermissions) return false
  if (channelPermissions.isOwner || channelPermissions.isModerator) return true

  return false
}

export const canAdministerCommunity = async (userId: string, communityId: string, loaders: any) => {
  if (!userId || !communityId) return false

  const community = await communityExists(communityId, loaders)
  if (!community) return false

  const communityPermissions = await loaders.userPermissionsInCommunity.load([
    userId,
    communityId
  ])

  if (communityPermissions && communityPermissions.isOwner) return true
  return false
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

export const canViewCommunity = async (user: DBUser, communityId: string, loaders: any) => {
  if (!communityId) return false

  const community = await communityExists(communityId, loaders)
  if (!community) return false

  if (!community.isPrivate) return true

  if (!user) return false

  const communityPermissions = await loaders.userPermissionsInCommunity.load([
    user.id,
    communityId
  ])

  if (!communityPermissions) return false
  if (!communityPermissions.isMember) return false

  return true
}
