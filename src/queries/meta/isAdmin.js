// @flow
import type { GraphQLContext } from '../../flowTypes'
import { isAdmin } from '../../utils/permissions'

export default (_: any, __: any, { user }: GraphQLContext): boolean => {
  if (!user || !isAdmin(user.id)) return false
  return true
}