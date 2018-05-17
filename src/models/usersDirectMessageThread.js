// @flow
import db from '../db'

export const getMembersInDirectMessageThreads = (threadIds: Array<string>): Promise<Array<Object>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(...threadIds, { index: 'threadId' })
    .eqJoin('userId', db.table('users'))
    .without({ left: ['createdAt'], right: ['id', 'lastSeen'] })
    .group(rec => rec('left')('threadId'))
    .zip()
    .run()
}
