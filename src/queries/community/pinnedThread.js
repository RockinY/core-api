// @flow
import type { DBCommunity, GraphQLContext } from '../../flowTypes'
import { getThreadById } from '../../models/thread'
import { canViewCommunity } from '../../utils/permissions'

export default async (root: DBCommunity, _: any, ctx: GraphQLContext) => {
  const { user, loaders } = ctx
  const { pinnedThreadId, id } = root

  if (!pinnedThreadId) return null

  if (!await canViewCommunity(user, id, loaders)) {
    return null
  }

  return getThreadById(pinnedThreadId)
}
