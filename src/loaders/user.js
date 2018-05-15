// @flow
import createLoader from './createLoader'
import {
  getUsers,
  getUsersByUsername
} from '../models/user'
import {
  getUsersPermissionsInChannels
} from '../models/usersChannels'

export const __createUserLoader = createLoader(
  users => getUsers(users),
  'id'
)

export const __createUserByUsernameLoader = createLoader(
  users => getUsersByUsername(users),
  'username'
)

export const __createUserPermissionsInChannelLoader = createLoader(
  usersChannels => getUsersPermissionsInChannels(usersChannels),
  input => `${input.userId}|${input.channelId}`,
  key => (Array.isArray(key) ? `${key[0]}|${key[1]}` : key)
)
