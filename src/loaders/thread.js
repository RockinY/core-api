// @flow
import { getThreads } from '../models/thread'
import createLoader from './createLoader'

export const __createThreadLoader = createLoader(threads => {
  return getThreads(threads)
})

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  )
}
