// @flow
import type { DBReaction } from '../../flowTypes'
import { getMessage } from '../../models/message'

export default (
  { messageId }: DBReaction
) => {
  return getMessage(messageId)
}
