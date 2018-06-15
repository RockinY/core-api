// @flow
import type { GraphQLContext, DBThread } from '../../flowTypes'

export default ({ id }: DBThread, _: any, { loaders }: GraphQLContext) => {
  return loaders.threadParticipants
    .load(id)
    .then(result => (result ? result.reduction : []))
}
