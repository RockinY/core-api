import { DBCommunity, GraphQLContext } from '../../flowTypes'

export default (
  { id }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  if (!id || !user) {
    return {}
  }
  return loaders.userPermissionsInCommunity
    .load([user.id, id])
    .then(result => (result || {}))
}
