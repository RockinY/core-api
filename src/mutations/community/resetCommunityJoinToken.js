// @flow
import type { GraphQLContext } from '../../flowTypes'
import UserError from '../../utils/userError'
import {
  getOrCreateCommunitySettings,
  resetCommunityJoinToken
} from '../../models/communitySettings'
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity
} from '../../utils/permissions'

type Input = {
  input: {
    id: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { id: communityId } = args.input
  const { user, loaders } = ctx

  if (!await canModerateCommunity(user.id, communityId, loaders)) {
    return new UserError('You don’t have permission to manage this community')
  }

  return await getOrCreateCommunitySettings(communityId).then(
    async () => await resetCommunityJoinToken(communityId, user.id)
  )
})
