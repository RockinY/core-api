// @flow
import type { DBUsersCommunities, GraphQLContext } from '../../flowTypes'

export default async (
  { userId }: DBUsersCommunities,
  _: any,
  { loaders }: GraphQLContext
) => {
  if (userId) return loaders.user.load(userId)
  return null
}
