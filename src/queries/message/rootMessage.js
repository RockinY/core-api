// @flow
import type { GraphQLContext } from '../../flowTypes'

export default (
  _: any,
  { id }: { id: string },
  { loaders }: GraphQLContext
) => {
  return loaders.message.load(id)
}
