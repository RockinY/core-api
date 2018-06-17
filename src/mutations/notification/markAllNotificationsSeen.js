// @flow
import type { GraphQLContext } from '../../flowTypes'
import { markAllNotificationsSeen } from '../../models/usersNotifications'
import { isAuthedResolver as requireAuth } from '../../utils/permissions'

export default requireAuth(
  async (_: any, __: any, { user }: GraphQLContext) => {
    return await markAllNotificationsSeen(user.id)
  }
)
