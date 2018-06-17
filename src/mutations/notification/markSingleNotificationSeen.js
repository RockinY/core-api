// @flow
import type { GraphQLContext } from '../../flowTypes'
import { markSingleNotificationSeen } from '../../models/usersNotifications'
import { isAuthedResolver as requireAuth } from '../../utils/permissions'

export default requireAuth(
  async (_: any, { id }: { id: string }, { user }: GraphQLContext) => {
    return await markSingleNotificationSeen(id, user.id)
  }
)
