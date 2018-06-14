// @flow
import createLoader from './createLoader'
import {
  getUsers,
  getUsersByUsername,
  getUsersThreadCount
} from '../models/user'
import {
  getUsersPermissionsInCommunities,
  getUsersTotalReputation
} from '../models/usersCommunities'
import {
  getUsersPermissionsInChannels
} from '../models/usersChannels'
import { getThreadsNotificationStatusForUsers } from '../models/usersThreads'

export const __createUserLoader = createLoader(
  users => getUsers(users),
  'id'
)

export const __createUserByUsernameLoader = createLoader(
  users => getUsersByUsername(users),
  'username'
)

export const __createUserThreadCountLoader = createLoader(
  users => getUsersThreadCount(users),
  'id'
)

export const __createUserTotalReputationLoader = createLoader(
  users => getUsersTotalReputation(users),
  'userId'
)

export const __createUserThreadNotificationStatusLoader = createLoader(
  usersThreads => getThreadsNotificationStatusForUsers(usersThreads),
  input => `${input.userId}|${input.threadId}`,
  key => (Array.isArray(key) ? `${key[0]}|${key[1]}` : key)
)

export const __createUserPermissionsInChannelLoader = createLoader(
  usersChannels => getUsersPermissionsInChannels(usersChannels),
  input => `${input.userId}|${input.channelId}`,
  key => (Array.isArray(key) ? `${key[0]}|${key[1]}` : key)
)

export const __createUserPermissionsInCommunityLoader = createLoader(
  usersCommunities => getUsersPermissionsInCommunities(usersCommunities),
  input => `${input.userId}|${input.communityId}`,
  key => (Array.isArray(key) ? `${key[0]}|${key[1]}` : key)
)

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  )
}
