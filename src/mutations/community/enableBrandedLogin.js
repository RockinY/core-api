// @flow
import type { GraphQLContext } from '../../flowTypes'
import UserError from '../../utils/userError'
import {
  createCommunitySettings,
  enableCommunityBrandedLogin
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
    return new UserError("You don't have permission to do this.")
  }

  const settings = await loaders.communitySettings.load(communityId)

  loaders.communitySettings.clear(communityId)

  // settings.id tells us that a channelSettings record exists in the db
  if (settings.id) {
    return await enableCommunityBrandedLogin(communityId, user.id)
  } else {
    return await createCommunitySettings(communityId).then(
      async () => await enableCommunityBrandedLogin(communityId, user.id)
    )
  }
})
