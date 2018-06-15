// @flow
import type { DBMessage, GraphQLContext } from '../../flowTypes'

export default (
  { parentId }: DBMessage,
  _: void,
  { loaders }: GraphQLContext
) => {
  if (!parentId) return null
  return loaders.message.load(parentId)
}
