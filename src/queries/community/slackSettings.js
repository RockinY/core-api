// @flow
import type { DBCommunity, GraphQLContext } from '../../flowTypes'
import UserError from '../../utils/userError'
import {
  canModerateCommunity,
  isAuthedResolver as requireAuth
} from '../../utils/permissions'

export default requireAuth(
  async ({ id }: DBCommunity, _: any, { user, loaders }: GraphQLContext) => {
    if (!await canModerateCommunity(user.id, id, loaders)) {
      return new UserError('You don’t have permission to manage this channel')
    }

    return loaders.communitySettings.load(id)
  }
)
