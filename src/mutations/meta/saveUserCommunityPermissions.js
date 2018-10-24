// @flow
import type { GraphQLContext } from '../../flowTypes'
import UserError from '../../utils/userError'
import { isAdmin } from '../../utils/permissions'
import { saveUserCommunityPermissions } from '../../models/meta';

export default (
  _: any,
  { input }: { input: any },
  { user }: GraphQLContext
) => {
  const currentUser = user

  if (!isAdmin(currentUser.id)) {
    return new UserError('Failure')
  }

  const { id, ...permissions } = input
  const userId = currentUser.id
  const communityId = id
  saveUserCommunityPermissions(permissions, userId, communityId)
}