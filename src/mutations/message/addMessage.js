// @flow
import { markdownToDraft } from 'markdown-draft-js'
import type { GraphQLContext, FileUpload } from '../../flowTypes'
import UserError from '../../utils/userError'
import { uploadImage } from '../../utils/oss'
import { storeMessage, getMessage } from '../../models/message'
import { setDirectMessageThreadLastActive } from '../../models/directMessageThread'
import { setUserLastSeenInDirectMessageThread } from '../../models/usersDirectMessageThreads'
import { createMemberInChannel } from '../../models/usersChannels'
import { createParticipantInThread } from '../../models/usersThreads'
import addCommunityMember from '../communityMember/addCommunityMember'
import { isAuthedResolver as requireAuth } from '../../utils/permissions'

type Input = {
  message: {
    threadId: string,
    threadType: 'story' | 'directMessageThread',
    messageType: 'text' | 'media' | 'draftjs',
    content: {
      body: string,
    },
    parentId?: string,
    file?: FileUpload,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { message } = args
  const { user, loaders } = ctx

  if (message.messageType === 'media' && !message.file) {
    return new UserError(
      "Can't send media message without an image, please try again."
    )
  }

  if (message.messageType !== 'media' && message.file) {
    return new UserError(
      `To send an image, please use messageType: "media" instead of "${
        message.messageType
      }".`
    )
  }

  if (message.messageType === 'text') {
    message.content.body = JSON.stringify(
      markdownToDraft(message.content.body)
    )
    message.messageType = 'draftjs'
  }

  if (message.messageType === 'draftjs') {
    let body
    try {
      body = JSON.parse(message.content.body)
    } catch (err) {
      return new UserError(
        'Please provide serialized raw DraftJS content state as content.body'
      )
    }
    if (!body.blocks || !Array.isArray(body.blocks) || !body.entityMap) {
      return new UserError(
        'Please provide serialized raw DraftJS content state as content.body'
      )
    }
    if (
      body.blocks.some(
        ({ type }) => !type || (type !== 'unstyled' && type !== 'code-block')
      )
    ) {
      return new UserError(
        'Invalid DraftJS block type specified. Supported block types: "unstyled", "code-block".'
      )
    }
  }

  if (message.parentId) {
    const parent = await getMessage(message.parentId)
    if (parent.threadId !== message.threadId) {
      return new UserError('You can only quote messages from the same thread.')
    }
  }

  // construct the shape of the object to be stored in the db
  let messageForDb = Object.assign({}, message)
  if (message.file && message.messageType === 'media') {
    const { file } = message

    const fileMetaData = {
      name: file.filename,
      size: null,
      type: file.mimetype
    }

    let url
    try {
      url = await uploadImage(file, 'threads', message.threadId)
    } catch (err) {
      return new UserError(err.message)
    }

    if (!url) {
      return new UserError(
        "We weren't able to upload this image, please try again"
      )
    }

    messageForDb = Object.assign({}, messageForDb, {
      content: {
        body: url
      },
      file: fileMetaData
    })
  }

  const messagePromise = async () => await storeMessage(messageForDb, user.id)

  // handle DM thread messages up front
  if (message.threadType === 'directMessageThread') {
    setDirectMessageThreadLastActive(message.threadId)
    setUserLastSeenInDirectMessageThread(message.threadId, user.id)
    return await messagePromise()
  }

  // at this point we are only dealing with thread messages
  const thread = await loaders.thread.load(message.threadId)

  if (!thread || thread.deletedAt) {
    return new UserError("Can't reply in a deleted thread.")
  }

  if (thread.isLocked) {
    return new UserError("Can't reply in a locked thread.")
  }

  const [communityPermissions, channelPermissions, channel] = await Promise.all(
    [
      loaders.userPermissionsInCommunity.load([user.id, thread.communityId]),
      loaders.userPermissionsInChannel.load([user.id, thread.channelId]),
      loaders.channel.load(thread.channelId)
    ]
  )

  if (!channel || channel.deletedAt) {
    return new UserError('This channel doesn’t exist')
  }

  if (channel.archivedAt) {
    return new UserError('This channel has been archived')
  }

  const isBlockedInCommunity =
    communityPermissions && communityPermissions.isBlocked
  const isBlockedInChannel = channelPermissions && channelPermissions.isBlocked

  // user can't post if blocked at any level
  if (isBlockedInCommunity || isBlockedInChannel) {
    return new UserError(
      "You don't have permission to post in this conversation"
    )
  }

  if (
    channel.isPrivate &&
    (!channelPermissions || !channelPermissions.isMember)
  ) {
    return new UserError(
      'You dont’t have permission to post in this conversation'
    )
  }

  // dummy async function that will run if the user is already a member of the
  // channel where the message is being sent
  let membershipPromise = async () => await {}

  // if the user is a member of the community, but is not a member of the channel,
  // make sure they join the channel first
  if (
    communityPermissions &&
    communityPermissions.isMember &&
    (!channelPermissions || !channelPermissions.isMember)
  ) {
    membershipPromise = async () =>
      await createMemberInChannel(thread.channelId, user.id, false)
  }

  // if the user is not a member of the community, or has previously joined
  // and left the community, re-join and sub to default channels
  if (
    !communityPermissions ||
    (communityPermissions && !communityPermissions.isMember)
  ) {
    membershipPromise = async () =>
      await addCommunityMember(
        {},
        { input: { communityId: thread.communityId } },
        { user: user, loaders: loaders }
      )
  }

  return membershipPromise()
    .then(() => createParticipantInThread(message.threadId, user.id))
    .then(() => messagePromise())
    .then(async dbMessage => {
      const contextPermissions = {
        communityId: thread.communityId,
        reputation: communityPermissions ? communityPermissions.reputation : 0,
        isModerator: communityPermissions
          ? communityPermissions.isModerator
          : false,
        isOwner: communityPermissions ? communityPermissions.isOwner : false
      }

      return {
        ...dbMessage,
        contextPermissions
      }
    })
    .catch(err => {
      console.error('Error sending message', err)
      return new UserError('Error sending message, please try again')
    })
})
