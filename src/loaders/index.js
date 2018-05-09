// @flow
import type { DataLoaderOptions } from '../flowtypes'
import {
  __createUserLoader,
  __createUserByUsernameLoader
} from './user'

const createLoaders = (options?: DataLoaderOptions) => ({
  user: __createUserLoader(options),
  userByUsername: __createUserByUsernameLoader(options)
})

export default createLoaders
