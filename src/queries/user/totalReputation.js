// @flow
import type { GraphQLContext, DBUser } from '../../flowTypes'

export default ({ id }: DBUser, _: any, { loaders }: GraphQLContext) => {
  if (!id) return 0
  return loaders.userTotalReputation
    .load(id)
    .then(data => (data ? data.reputation : 0))
}
