// @flow
import db from '../db'
import type { DBThread } from '../flowTypes'

export const getThreads = (
  threadIds: Array<string>
): Promise<Array<DBThread>> => {
  return db
    .table('threads')
    .getAll(...threadIds)
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run()
}
