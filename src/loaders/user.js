// @flow
import createLoader from './createLoader'
import {
  getUsers,
  getUsersByUsername
} from '../models/user'

export const __createUserLoader = createLoader(
  users => getUsers(users),
  'id'
)

export const __createUserByUsernameLoader = createLoader(
  users => getUsersByUsername(users),
  'username'
)
