// @flow
import type { DataLoaderOptions } from '../flowtypes'
import {
  __createUserLoader,
  __createUserByUsernameLoader,
  __createUserPermissionsInChannelLoader
} from './user'
import {
  __createCommunityLoader,
  __createCommunityBySlugLoader
} from './community'
import {
  __createChannelLoader
} from './channel'
import {
  __createThreadLoader
} from './thread'
import {
  __createMessageLoader
} from './message'
import {
  __createDirectMessageParticipantsLoader,
  __createDirectMessageThreadLoader
} from './directMessageThread'

const createLoaders = (options?: DataLoaderOptions) => ({
  user: __createUserLoader(options),
  userPermissionsInChannel: __createUserPermissionsInChannelLoader(options),
  userByUsername: __createUserByUsernameLoader(options),
  community: __createCommunityLoader(options),
  communityBySlug: __createCommunityBySlugLoader(options),
  channel: __createChannelLoader(options),
  thread: __createThreadLoader(options),
  message: __createMessageLoader(options),
  directMessageThread: __createDirectMessageThreadLoader(options),
  directMessageParticipants: __createDirectMessageParticipantsLoader(options)
})

export default createLoaders
