import { DBCommunity, GraphQLContext } from '../../flowTypes'

export default (
  community: DBCommunity,
  _: any,
  { loaders }: GraphQLContext,
  info: any
) => {
  if (community.contextPermissions) {
    return community.contextPermissions
  }

  const queryName = info.operation.name.value

  const handleCheck = async () => {
    switch (queryName) {
      case 'getUser': {
        const username = info.variableValues.username
        const user = await loaders.userByUsername.load(username)
        const {
          reputation,
          isModerator,
          isOwner
        } = await loaders.userPermissionsInCommunity.load([
          user.id,
          community.id
        ])
        return {
          communityId: community.id,
          reputation,
          isModerator,
          isOwner
        }
      }
    }
  }

  return handleCheck()
}
