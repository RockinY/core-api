// @flow
import db from '../db'

const createMemberInDirectMessageThread = (threadId: string, userId: string, setActive: boolean): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .insert(
      {
        threadId,
        userId,
        createdAt: new Date(),
        lastActive: setActive ? new Date() : null,
        lastSeen: setActive ? new Date() : null,
        receiveNotifications: true
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
}

const removeMemberInDirectMessageThread = (threadId: string, userId: string): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .filter({ userId })
    .delete()
    .run()
}

const removeMembersInDirectMessageThread = (threadId: string): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .delete()
    .run()
}

const setUserLastSeenInDirectMessageThread = (threadId: string, userId: string): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(userId, { index: 'userId' })
    .filter({ threadId })
    .update({
      lastSeen: db.now()
    })
    .run()
    .then(() =>
      db
        .table('directMessageThreads')
        .get(threadId)
        .run()
    )
}

const updateDirectMessageThreadNotificationStatusForUser = (threadId: string, userId: string, val: boolean): Promise<Object> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(userId, { index: 'userId' })
    .filter({ threadId })
    .update({
      receiveNotifications: val
    })
    .run()
}

const getMembersInDirectMessageThread = (threadId: string): Promise<Array<Object>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })
    .eqJoin('userId', db.table('users'))
    .without({ left: ['createdAt'], right: ['id', 'lastSeen'] })
    .zip()
    .run()
}

const getMembersInDirectMessageThreads = (threadIds: Array<string>): Promise<Array<Object>> => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(...threadIds, { index: 'threadId' })
    .eqJoin('userId', db.table('users'))
    .without({ left: ['createdAt'], right: ['id', 'lastSeen'] })
    .group(rec => rec('left')('threadId'))
    .zip()
    .run()
}

const isMemberOfDirectMessageThread = (threadId: string, userId: string) => {
  return db
    .table('usersDirectMessageThreads')
    .getAll(threadId, { index: 'threadId' })('userId')
    .contains(userId)
    .run()
}

module.exports = {
  createMemberInDirectMessageThread,
  removeMemberInDirectMessageThread,
  removeMembersInDirectMessageThread,
  setUserLastSeenInDirectMessageThread,
  updateDirectMessageThreadNotificationStatusForUser,
  // get
  getMembersInDirectMessageThread,
  getMembersInDirectMessageThreads,
  isMemberOfDirectMessageThread
}
