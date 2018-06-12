// @flow
import type { DBUser } from '../../flowTypes'

export default (_: any, __: any, { user }: { user: DBUser }) => {
  if (user && !user.bannedAt) {
    return user
  }
  return null
}
