// @flow
import type { GraphQLContext } from '../../flowTypes'
import { isAdmin } from '../../utils/permissions'
import { getCount, getGrowth } from '../../models/utils'

export default async (_: any, __: any, { user }: GraphQLContext) => {
  if (!isAdmin(user.id)) return null

  return {
    count: await getCount('communities'),
    weeklyGrowth: await getGrowth('communities', 'weekly', 'createdAt'),
    monthlyGrowth: await getGrowth('communities', 'monthly', 'createdAt'),
    quarterlyGrowth: await getGrowth('communities', 'quarterly', 'createdAt')
  }
}