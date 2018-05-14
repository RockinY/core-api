// @flow
import type { DataLoaderOptions } from '../flowtypes'
import {
  __createUserLoader,
  __createUserByUsernameLoader
} from './user'
import {
  __createCommunityLoader,
  __createCommunityBySlugLoader
} from './community'
import {
  __createChannelLoader
} from './channel'

const createLoaders = (options?: DataLoaderOptions) => ({
  user: __createUserLoader(options),
  userByUsername: __createUserByUsernameLoader(options),
  community: __createCommunityLoader(options),
  communityBySlug: __createCommunityBySlugLoader(options),
  channel: __createChannelLoader(options)
})

export default createLoaders
