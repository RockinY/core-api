// @flow
import type { GraphQLContext, DBUser } from '../../flowTypes'

export default ({ id }: DBUser, _: any, { loaders }: GraphQLContext) => {
  return loaders.userThreadCount.load(id).then(data => (data ? data.count : 0))
}
