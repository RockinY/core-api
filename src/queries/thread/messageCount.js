// @flow
import type { GraphQLContext, DBThread } from '../../flowTypes'

export default ({ id }: DBThread, __: any, { loaders }: GraphQLContext) => {
  return loaders.threadMessageCount
    .load(id)
    .then(messageCount => (messageCount ? messageCount.reduction : 0))
}
