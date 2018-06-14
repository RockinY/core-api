// @flow
import { getDirectMessageThreads } from '../models/directMessageThread'
import { getMembersInDirectMessageThreads } from '../models/usersDirectMessageThread'
import { getLastMessages } from '../models/message'
import createLoader from './createLoader'
import type { Loader } from '../flowTypes'

export const __createDirectMessageThreadLoader = createLoader(threads => {
  return getDirectMessageThreads(threads)
})

export const __createDirectMessageParticipantsLoader = createLoader(threads => {
  return getMembersInDirectMessageThreads(threads)
}, 'group')

export const __createDirectMessageSnippetLoader = createLoader(
  threads => getLastMessages(threads),
  'group'
)

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  )
}
