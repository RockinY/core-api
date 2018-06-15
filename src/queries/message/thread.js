// @flow
import type { DBMessage } from '../../flowTypes'
import { getThread } from '../../models/thread'

export default ({ threadId }: DBMessage) => getThread(threadId)
