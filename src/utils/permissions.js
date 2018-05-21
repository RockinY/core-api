// @flow
import {
  COMMUNITY_SLUG_BLACKLIST,
  CHANNEL_SLUG_BLACKLIST
} from './slugBlacklists'
import type { GraphQLContext } from '../flowTypes'
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
