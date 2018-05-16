// @flow
import { getManyMessages } from '../models/message'
import createLoader from './createLoader'

export const __createMessageLoader = createLoader((messages: string[]) => {
  return getManyMessages(messages)
})

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  )
}
