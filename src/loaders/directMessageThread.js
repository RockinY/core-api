// @flow
import { getDirectMessageThreads } from '../models/directMessageThread'
import { getMembersInDirectMessageThreads } from '../models/usersDirectMessageThread'
import createLoader from './createLoader'

export const __createDirectMessageThreadLoader = createLoader(threads => {
  return getDirectMessageThreads(threads)
})

export const __createDirectMessageParticipantsLoader = createLoader(threads => {
  return getMembersInDirectMessageThreads(threads)
}, 'group')
