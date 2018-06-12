// @flow
import db from '../db'
import intersection from 'lodash.intersection'
import type { DBThread, FileUpload } from '../flowTypes'
import type { Timeframe } from './utils'
import type { PaginationOptions } from '../utils/paginateArrays'
import { NEW_DOCUMENTS, parseRange } from './utils'
import { createChangefeed } from '../utils/changeFeed'
import { deleteMessagesInThread } from './message'
import { turnOffAllThreadNotifications } from './usersThreads'

export const getThread = (threadId: string): Promise<DBThread> => {
  return db
    .table('threads')
    .get(threadId)
    .run()
}

export const getThreads = (
  threadIds: Array<string>
): Promise<Array<DBThread>> => {
  return db
    .table('threads')
    .getAll(...threadIds)
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run()
}

export const getThreadById = (threadId: string): Promise<?DBThread> => {
  return db
    .table('threads')
    .getAll(threadId)
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run()
    .then(results => {
      if (!results || results.length === 0) return null
      return results[0]
    })
}

export const getThreadsByChannelToDelete = (channelId: string) => {
  return db
    .table('threads')
    .getAll(channelId, { index: 'channelId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run()
}

export const getThreadsByChannel = (channelId: string, options: PaginationOptions): Promise<Array<DBThread>> => {
  const { first, after } = options

  return db
    .table('threads')
    .between(
      [channelId, db.minval],
      [channelId, after ? new Date(after) : db.maxval],
      {
        index: 'channelIdAndLastActive',
        leftBound: 'open',
        rightBound: 'open'
      }
    )
    .orderBy({ index: db.desc('channelIdAndLastActive') })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .limit(first)
    .run()
}

export const getThreadsByChannels = (channelIds: Array<string>, options: PaginationOptions): Promise<Array<DBThread>> => {
  const { first, after } = options

  return db
    .table('threads')
    .getAll(...channelIds, { index: 'channelId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first || 999999)
    .run()
}

export const getThreadsByCommunity = (communityId: string): Promise<Array<DBThread>> => {
  return db
    .table('threads')
    .between([communityId, db.minval], [communityId, db.maxval], {
      index: 'communityIdAndLastActive',
      leftBound: 'open',
      rightBound: 'open'
    })
    .orderBy({ index: db.desc('communityIdAndLastActive') })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run()
}

// prettier-ignore
export const getThreadsByCommunityInTimeframe = (communityId: string, range: Timeframe): Promise<Array<Object>> => {
  const { current } = parseRange(range)
  return db
    .table('threads')
    .getAll(communityId, { index: 'communityId' })
    .filter(db.row('createdAt').during(db.now().sub(current), db.now()))
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run()
}

export const getThreadsInTimeframe = (range: Timeframe): Promise<Array<Object>> => {
  const { current } = parseRange(range)
  return db
    .table('threads')
    .filter(db.row('createdAt').during(db.now().sub(current), db.now()))
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .run()
}

export const getThreadsByUserAsSpamCheck = (
  userId: string,
  timeframe: number = 60 * 10
): Promise<Array<?DBThread>> => {
  return db
    .table('threads')
    .getAll(userId, { index: 'creatorId' })
    .filter(db.row('createdAt').during(db.now().sub(timeframe), db.now()))
    .run()
}

export const getViewableThreadsByUser = async (
  evalUser: string,
  currentUser: string,
  options: PaginationOptions
): Promise<Array<DBThread>> => {
  const { first, after } = options
  // get a list of the channelIds the current user is allowed to see threads
  const getCurrentUsersChannelIds = db
    .table('usersChannels')
    .getAll(currentUser, { index: 'userId' })
    .filter({ isBlocked: false, isMember: true })
    .map(userChannel => userChannel('channelId'))
    .run()

  const getCurrentUserCommunityIds = db
    .table('usersCommunities')
    .getAll(currentUser, { index: 'userId' })
    .filter({ isMember: true })
    .map(userCommunity => userCommunity('communityId'))
    .run()

  // get a list of the channels where the user posted a thread
  const getPublishedChannelIds = db
    .table('threads')
    .getAll(evalUser, { index: 'creatorId' })
    .map(thread => thread('channelId'))
    .run()

  const getPublishedCommunityIds = db
    .table('threads')
    .getAll(evalUser, { index: 'creatorId' })
    .map(thread => thread('communityId'))
    .run()

  const [
    currentUsersChannelIds,
    publishedChannelIds,
    currentUsersCommunityIds,
    publishedCommunityIds
  ] = await Promise.all([
    getCurrentUsersChannelIds,
    getPublishedChannelIds,
    getCurrentUserCommunityIds,
    getPublishedCommunityIds
  ])

  // get a list of all the channels that are public
  const publicChannelIds = await db
    .table('channels')
    .getAll(...publishedChannelIds)
    .filter({ isPrivate: false })
    .map(channel => channel('id'))
    .run()

  const publicCommunityIds = await db
    .table('communities')
    .getAll(...publishedCommunityIds)
    .filter({ isPrivate: false })
    .map(community => community('id'))
    .run()

  const allIds = [
    ...currentUsersChannelIds,
    ...currentUsersCommunityIds,
    ...publicChannelIds,
    ...publicCommunityIds
  ]
  const distinctIds = allIds.filter((x, i, a) => a.indexOf(x) == i)
  let validChannelIds = intersection(distinctIds, publishedChannelIds)
  let validCommunityIds = intersection(distinctIds, publishedCommunityIds)

  // takes ~70ms for a heavy load
  return await db
    .table('threads')
    .getAll(evalUser, { index: 'creatorId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .filter(thread => db.expr(validChannelIds).contains(thread('channelId')))
    .filter(thread =>
      db.expr(validCommunityIds).contains(thread('communityId'))
    )
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first)
    .run()
    .then(res => {
      return res
    })
}

export const getPublicThreadsByUser = (evalUser: string, options: PaginationOptions): Promise<Array<DBThread>> => {
  const { first, after } = options
  return db
    .table('threads')
    .getAll(evalUser, { index: 'creatorId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .eqJoin('channelId', db.table('channels'))
    .filter({ right: { isPrivate: false } })
    .without('right')
    .zip()
    .eqJoin('communityId', db.table('communities'))
    .filter({ right: { isPrivate: false } })
    .without('right')
    .zip()
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first || 10)
    .run()
}

export const getViewableParticipantThreadsByUser = async (
  evalUser: string,
  currentUser: string,
  options: PaginationOptions
): Promise<Array<DBThread>> => {
  const { first, after } = options
  // get a list of the channelIds the current user is allowed to see threads for
  const getCurrentUsersChannelIds = db
    .table('usersChannels')
    .getAll(currentUser, { index: 'userId' })
    .filter({ isBlocked: false, isMember: true })
    .map(userChannel => userChannel('channelId'))
    .run()

  const getCurrentUserCommunityIds = db
    .table('usersCommunities')
    .getAll(currentUser, { index: 'userId' })
    .filter({ isMember: true })
    .map(userCommunity => userCommunity('communityId'))
    .run()

  // get a list of the channels where the user participated in a thread
  const getParticipantChannelIds = db
    .table('usersThreads')
    .getAll(evalUser, { index: 'userId' })
    .filter({ isParticipant: true })
    .eqJoin('threadId', db.table('threads'))
    .zip()
    .pluck('channelId', 'threadId')
    .run()

  const getParticipantCommunityIds = db
    .table('usersThreads')
    .getAll(evalUser, { index: 'userId' })
    .filter({ isParticipant: true })
    .eqJoin('threadId', db.table('threads'))
    .zip()
    .pluck('communityId', 'threadId')
    .run()

  const [
    currentUsersChannelIds,
    participantChannelIds,
    currentUsersCommunityIds,
    participantCommunityIds
  ] = await Promise.all([
    getCurrentUsersChannelIds,
    getParticipantChannelIds,
    getCurrentUserCommunityIds,
    getParticipantCommunityIds
  ])

  const participantThreadIds = participantChannelIds.map(c => c.threadId)
  const distinctParticipantChannelIds = participantChannelIds
    .map(c => c.channelId)
    .filter((x, i, a) => a.indexOf(x) == i)

  const distinctParticipantCommunityIds = participantCommunityIds
    .map(c => c.communityId)
    .filter((x, i, a) => a.indexOf(x) == i)

  // get a list of all the channels that are public
  const publicChannelIds = await db
    .table('channels')
    .getAll(...distinctParticipantChannelIds)
    .filter({ isPrivate: false })
    .map(channel => channel('id'))
    .run()

  const publicCommunityIds = await db
    .table('communities')
    .getAll(...distinctParticipantCommunityIds)
    .filter({ isPrivate: false })
    .map(community => community('id'))
    .run()

  const allIds = [
    ...currentUsersChannelIds,
    ...publicChannelIds,
    ...currentUsersCommunityIds,
    ...publicCommunityIds
  ]
  const distinctIds = allIds.filter((x, i, a) => a.indexOf(x) == i)
  let validChannelIds = intersection(
    distinctIds,
    distinctParticipantChannelIds
  )
  let validCommunityIds = intersection(
    distinctIds,
    distinctParticipantCommunityIds
  )

  return db
    .table('threads')
    .getAll(...participantThreadIds)
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .filter(thread => db.expr(validChannelIds).contains(thread('channelId')))
    .filter(thread =>
      db.expr(validCommunityIds).contains(thread('communityId'))
    )
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first)
    .run()
    .then(res => {
      return res
    })
}

export const getPublicParticipantThreadsByUser = (evalUser: string, options: PaginationOptions): Promise<Array<DBThread>> => {
  const { first, after } = options
  return db
    .table('usersThreads')
    .getAll(evalUser, { index: 'userId' })
    .filter({ isParticipant: true })
    .eqJoin('threadId', db.table('threads'))
    .without({
      left: [
        'id',
        'userId',
        'threadId',
        'createdAt',
        'isParticipant',
        'receiveNotifications'
      ]
    })
    .zip()
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .eqJoin('channelId', db.table('channels'))
    .filter({ right: { isPrivate: false } })
    .without('right')
    .zip()
    .eqJoin('communityId', db.table('communities'))
    .filter({ right: { isPrivate: false } })
    .without('right')
    .zip()
    .orderBy(db.desc('lastActive'), db.desc('createdAt'))
    .skip(after || 0)
    .limit(first || 10)
    .run()
    .then(res => {
      return res
    })
}

export const publishThread = (
  { filesToUpload, ...thread }: Object,
  userId: string
): Promise<DBThread> => {
  return db
    .table('threads')
    .insert(
      Object.assign({}, thread, {
        creatorId: userId,
        createdAt: new Date(),
        lastActive: new Date(),
        modifiedAt: null,
        isPublished: true,
        isLocked: false,
        edits: []
      }),
      { returnChanges: true }
    )
    .run()
    .then(result => {
      const thread = result.changes[0].new_val
      // TODO: track queue
      return thread
    })
}

export const setThreadLock = (threadId: string, value: boolean, userId: string, byModerator: boolean = false): Promise<DBThread> => {
  return (
    db
      .table('threads')
      .get(threadId)
      // Note(@mxstbr): There surely is a better way to toggle a bool
      // with ReQL, I just couldn't find the API for it in a pinch
      .update(
        {
          isLocked: value,
          lockedBy: value === true ? userId : db.literal(),
          lockedAt: value === true ? new Date() : db.literal()
        },
        { returnChanges: true }
      )
      .run()
      .then(async () => {
        const thread = await getThreadById(threadId)
        return thread
      })
  )
}

export const deleteThread = (threadId: string, userId: string): Promise<Boolean> => {
  return db
    .table('threads')
    .get(threadId)
    .update(
      {
        deletedBy: userId,
        deletedAt: new Date()
      },
      {
        returnChanges: true,
        nonAtomic: true
      }
    )
    .run()
    .then(result =>
      Promise.all([
        result,
        turnOffAllThreadNotifications(threadId),
        deleteMessagesInThread(threadId, userId)
      ])
    )
    .then(([result]) => {
      const thread = result.changes[0].new_val
      return result.replaced >= 1
    })
}

type File = FileUpload

type Attachment = {
  attachmentType: string,
  data: string
}

export type EditThreadInput = {
  threadId: string,
  content: {
    title: string,
    body: ?string
  },
  attachments?: ?Array<Attachment>,
  filesToUpload?: ?Array<File>
}

export const editThread = (
  input: EditThreadInput,
  userId: string,
  shouldUpdate: boolean = true
): Promise<DBThread> => {
  return db
    .table('threads')
    .get(input.threadId)
    .update(
      {
        content: input.content,
        attachments: input.attachments,
        modifiedAt: shouldUpdate ? new Date() : null,
        edits: db.row('edits').append({
          content: db.row('content'),
          attachments: db.row('attachments'),
          timestamp: new Date()
        })
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      if (result.replaced === 1) {
        const thread = result.changes[0].new_val
        return thread
      }

      return result.changes[0].old_val
    })
}

export const setThreadLastActive = (threadId: string, value: Date) => {
  return db
    .table('threads')
    .get(threadId)
    .update({ lastActive: value })
    .run()
}

export const updateThreadWithImages = (id: string, body: string) => {
  return db
    .table('threads')
    .get(id)
    .update(
      {
        content: {
          body
        }
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      // if an update happened
      if (result.replaced === 1) {
        return result.changes[0].new_val
      }

      // no data was changed
      if (result.unchanged === 1) {
        return result.changes[0].old_val
      }

      return null
    })
}

export const moveThread = (id: string, channelId: string, userId: string) => {
  return db
    .table('threads')
    .get(id)
    .update(
      {
        channelId
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      if (result.replaced === 1) {
        const thread = result.changes[0].new_val
        return thread
      }
      return null
    })
}

const hasChanged = (field: string) =>
  db
    .row('old_val')(field)
    .ne(db.row('new_val')(field))
const LAST_ACTIVE_CHANGED = hasChanged('lastActive')

const getUpdatedThreadsChangefeed = () =>
  db
    .table('threads')
    .changes({
      includeInitial: false
    })
    .filter(NEW_DOCUMENTS.or(LAST_ACTIVE_CHANGED))('new_val')
    .run()

export const listenToUpdatedThreads = (cb: Function): Function => {
  return createChangefeed(
    getUpdatedThreadsChangefeed,
    cb,
    'listenToUpdatedThreads'
  )
}
