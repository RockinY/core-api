// @flow
import stringSimilarity from 'string-similarity'
import { markdownToDraft } from 'markdown-draft-js'
import type { GraphQLContext, FileUpload, DBThread } from '../../flowTypes'
import UserError from '../../utils/userError'
import { uploadImage } from '../../utils/oss'
import {
  publishThread,
  editThread,
  getThreadsByUserAsSpamCheck
} from '../../models/thread'
import { createParticipantInThread } from '../../models/usersThreads'
import { toPlainText, toState } from '../../utils/draft'
import { isAuthedResolver as requireAuth } from '../../utils/permissions'
const debug = require('debug')('api:mutations:thread:publish-thread')

const threadBodyToPlainText = (body: any): string => {
  return toPlainText(toState(JSON.parse(body)))
}
const OWNER_MODERATOR_SPAM_LIMIT = 5
const MEMBER_SPAM_LIMIT = 3
const SPAN_TIMEFRAME = 60 * 10

type Attachment = {
  attachmentType: string,
  data: string
}

type File = FileUpload

type Input = {
  thread: {
    channelId: string,
    communityId: string,
    type: 'DRAFTJS' | 'TEXT',
    content: {
      title: string,
      body?: string
    },
    attachments?: ?Array<Attachment>,
    filesToUpload?: ?Array<File>
  }
}

export default requireAuth(async (
  _:any,
  args: Input,
  ctx: GraphQLContext
) => {
  const { user, loaders } = ctx
  const { thread } = args

  let { type } = thread

  if (type === 'TEXT') {
    type = 'DRAFTJS'
    if (thread.content.body) {
      thread.content.body = JSON.stringify(
        markdownToDraft(thread.content.body)
      )
    }
  }

  thread.type = type

  const [
    currentUserChannelPermissions,
    currentUserCommunityPermissions,
    channel,
    community,
    usersPreviousPublishedThreads
  ] = await Promise.all([
    loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
    loaders.userPermissionsInCommunity.load([user.id, thread.communityId]),
    loaders.channel.load(thread.channelId),
    loaders.community.load(thread.communityId),
    getThreadsByUserAsSpamCheck(user.id, SPAN_TIMEFRAME)
  ])

  if (!community || community.deletedAt) {
    return new UserError("This community doesn't exist")
  }

  if (!channel || channel.deletedAt) {
    return new UserError('Channel archived')
  }

  if (
    !currentUserChannelPermissions.isMember ||
    currentUserChannelPermissions.isBlocked ||
    currentUserCommunityPermissions.isBlocked
  ) {
    return new UserError(
      "You don't have permission to create threads in this channel."
    )
  }

  // TODO: Consider private channel

  const isOwnerOrModerator =
    currentUserChannelPermissions.isOwner ||
    currentUserChannelPermissions.isModerator ||
    currentUserCommunityPermissions.isOwner ||
    currentUserCommunityPermissions.isModerator

  if (usersPreviousPublishedThreads && usersPreviousPublishedThreads.length > 0) {
    debug(
      'User has posted at least once in the previous 10m - running spam checks'
    )
    if (
      (isOwnerOrModerator &&
        usersPreviousPublishedThreads.length >= OWNER_MODERATOR_SPAM_LIMIT) ||
      (!isOwnerOrModerator &&
        usersPreviousPublishedThreads.length >= MEMBER_SPAM_LIMIT)
    ) {
      debug('User has posted at least 3 times in the previous 10m')

      return new UserError(
        'You’ve been posting a lot! Please wait a few minutes before posting more.'
      )
    }

    const checkForSpam = usersPreviousPublishedThreads.map(t => {
      if (!t) {
        return false
      }

      const incomingTitle = thread.content.title
      const thisTitle = t.content.title

      const titleSimilarity = stringSimilarity.compareTwoStrings(
        incomingTitle,
        thisTitle
      )
      debug(`Title similarity score for spam check: ${titleSimilarity}`)
      if (titleSimilarity > 0.8) return true

      if (thread.content.body) {
        const incomingBody = threadBodyToPlainText(thread.content.body)
        const thisBody = threadBodyToPlainText(t.content.body)

        if (incomingBody.length === 0 || thisBody.length === 0) return false

        const bodySimilarity = stringSimilarity.compareTwoStrings(
          incomingBody,
          thisBody
        )
        debug(`Body similarity score for spam check: ${bodySimilarity}`)
        if (bodySimilarity > 0.8) return true
      }

      return false
    })

    const isSpamming = checkForSpam.filter(Boolean).length > 0

    if (isSpamming) {
      debug('User is spamming similar content')

      return new UserError(
        'It looks like you’ve been posting about a similar topic recently - please wait a while before posting more.'
      )
    }
  }

  let threadObject = Object.assign({}, {
    ...thread,
    content: {
      ...thread.content,
      title: thread.content.title.trim()
    }
  })

  if (thread.attachments) {
    const attachments = thread.attachments.map(attachment => {
      return {
        attachmentType: attachment.attachmentType,
        data: JSON.parse(attachment.data)
      }
    })

    threadObject = Object.assign({}, threadObject, {
      attachments
    })
  }

  const dbThread: DBThread = await publishThread(threadObject, user.id)

  // TODO: check toxicity

  await createParticipantInThread(dbThread.id, user.id)

  if (!thread.filesToUpload || thread.filesToUpload.length === 0) {
    return dbThread
  }

  let urls
  try {
    urls = await Promise.all(
      thread.filesToUpload.map(
        file => file && uploadImage(file, 'threads', dbThread.id)
      )
    )
  } catch (err) {
    return new UserError(err.message)
  }

  if (dbThread.content.body) {
    const body = JSON.parse(dbThread.content.body)
    const imageKeys = Object.keys(body.entityMap).filter(
      key => body.entityMap[key].type === 'image'
    )
    urls.forEach((url, index) => {
      if (!body.entityMap[imageKeys[index]]) {
        return
      }
      body.entityMap[imageKeys[index]].data.src = url
    })

    return editThread(
      {
        threadId: dbThread.id,
        content: {
          ...dbThread.content,
          body: JSON.stringify(body)
        }
      },
      user.id,
      false
    )
  }
})
