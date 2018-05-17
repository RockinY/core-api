// @flow
import db from '../db'
import type { DBDirectMessageThread } from '../flowTypes'

export const getDirectMessageThreads = (ids: Array<string>): Promise<Array<DBDirectMessageThread>> => {

  return db
    .table('directMessageThreads')
    .getAll(...ids)
    .run()
}
