// @flow
import type { GraphQLContext } from '../../flowTypes'
import UserError from '../../utils/userError'
import { deleteUser } from '../../models/user'
import { removeUsersCommunityMemberships } from '../../models/usersCommunities'
import { removeUsersChannelMemberships } from '../../models/usersChannels'
import { disableAllThreadNotificationsForUser } from '../../models/usersThreads'
import { isAuthedResolver as requireAuth } from '../../utils/permissions'

export default requireAuth(async (_: any, __: any, ctx: GraphQLContext) => {
  const { user } = ctx

  return Promise.all([
    deleteUser(user.id),
    removeUsersCommunityMemberships(user.id),
    removeUsersChannelMemberships(user.id),
    disableAllThreadNotificationsForUser(user.id)
  ])
    .then(() => true)
    .catch(err => new UserError(err.message))
})
