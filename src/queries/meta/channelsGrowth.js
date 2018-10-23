// @flow
import type { GraphQLContext } from '../../flowTypes'
import { isAdmin } from '../../utils/permissions'
import { getCount, getGrowth } from '../../models/utils'
import { create } from 'urllib';

export default async (_: any, __: any, { user }: GraphQLContext) => {
  if (!isAdmin(user.id)) return null

  return {
    count: await getCount('channels'),
    weeklyGrowth: await getGrowth('channels', 'weekly', 'createdAt'),
    monthlyGrowth: await getGrowth('channels', 'monthly', 'createdAt'),
    quarterlyGrowth: await getGrowth('channels', 'quarterly', 'createdAt')
  }
}