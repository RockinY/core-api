// @flow
import type { GraphQLContext, DBUser } from '../../flowTypes'
import { getUsersSettings } from '../../models/usersSettings'
import UserError from '../../utils/userError'

export default (_: DBUser, __: any, { user }: GraphQLContext) => {
  if (!user) {
    return new UserError('You must be signed in to continue.')
  }
  return getUsersSettings(user.id)
}
