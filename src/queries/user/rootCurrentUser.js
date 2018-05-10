// @flow
import type { GraphQLContext } from '../../flowTypes'

export default (_: any, __: any, { user }): GraphQLContext => {
  if (user && !user.bannedAt) {
    return user
  }
  return null
}
