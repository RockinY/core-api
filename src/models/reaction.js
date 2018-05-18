// @flow
import db from '../db'
import type { DBReaction } from '../flowTypes'

export const getReaction = (reactionId: string): Promise<DBReaction> => {
  return db
    .table('reactions')
    .get(reactionId)
    .run()
}
