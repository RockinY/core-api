// @flow
import type { GraphQLContext } from '../../flowTypes'
import { isAdmin } from '../../utils/permissions'
import { getCount, getGrowth } from '../../models/utils'

export default async (_: any, __: any, { user }: GraphQLContext) => {
  if (!isAdmin(user.id)) return null

  return {
    count: await getCount('messages'),
    weeklyGrowth: await getGrowth('messages', 'weekly', 'timestamp'),
    monthlyGrowth: await getGrowth('messages', 'monthly', 'timestamp'),
    quarterlyGrowth: await getGrowth('messages', 'quarterly', 'timestamp')
  }
}