// @flow
import type { GraphQLContext } from '../../flowTypes'
import type { EditCommunityInput } from '../../models/community'
import UserError from '../../utils/userError'
import { editCommunity } from '../../models/community'
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity
} from '../../utils/permissions'

export default requireAuth(
  // prettier-ignore
  async (_: any, args: EditCommunityInput, ctx: GraphQLContext) => {
    const { user, loaders} = ctx
    const { communityId } = args.input

    // user must own the community to edit the community
    if (!await canModerateCommunity(user.id, communityId, loaders)) {
      return new UserError("You don't have permission to edit this community.")
    }

    return editCommunity(args, user.id)
  }
)
