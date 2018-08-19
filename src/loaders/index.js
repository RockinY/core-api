// @flow
import type { DataLoaderOptions } from '../flowtypes'
import {
  __createUserLoader,
  __createUserByUsernameLoader,
  __createUserThreadCountLoader,
  __createUserTotalReputationLoader,
  __createUserThreadNotificationStatusLoader,
  __createUserPermissionsInChannelLoader,
  __createUserPermissionsInCommunityLoader
} from './user'
import {
  __createCommunityLoader,
  __createCommunityBySlugLoader,
  __createCommunityMemberCountLoader,
  __createCommunityChannelCountLoader,
  __createCommunitySettingsLoader
} from './community'
import {
  __createChannelLoader,
  __createChannelMemberCountLoader,
  __createChannelThreadCountLoader,
  __createChannelPendingMembersLoader,
  __createChannelSettingsLoader
} from './channel'
import {
  __createThreadLoader,
  __createThreadParticipantsLoader,
  __createThreadMessageCountLoader
} from './thread'
import {
  __createMessageLoader
} from './message'
import {
  __createDirectMessageParticipantsLoader,
  __createDirectMessageThreadLoader,
  __createDirectMessageSnippetLoader
} from './directMessageThread'
import {
  __createNotificationLoader
} from './notification'
import {
  __createReactionLoader,
  __createSingleReactionLoader
} from './reaction'
import { __createThreadReactionLoader } from './threadReaction'
import {
  __createMemberSubscriptionLoader
} from './memberSubscription'

const createLoaders = (options?: DataLoaderOptions) => ({
  user: __createUserLoader(options),
  userByUsername: __createUserByUsernameLoader(options),
  userThreadCount: __createUserThreadCountLoader(options),
  userPermissionsInCommunity: __createUserPermissionsInCommunityLoader(options),
  userPermissionsInChannel: __createUserPermissionsInChannelLoader(options),
  userTotalReputation: __createUserTotalReputationLoader(options),
  userThreadNotificationStatus: __createUserThreadNotificationStatusLoader(
    options
  ),
  memberSubscriptions: __createMemberSubscriptionLoader,
  thread: __createThreadLoader(options),
  threadParticipants: __createThreadParticipantsLoader(options),
  threadMessageCount: __createThreadMessageCountLoader(options),
  notification: __createNotificationLoader(options),
  channel: __createChannelLoader(options),
  channelMemberCount: __createChannelMemberCountLoader(options),
  channelThreadCount: __createChannelThreadCountLoader(options),
  channelPendingUsers: __createChannelPendingMembersLoader(options),
  channelSettings: __createChannelSettingsLoader(options),
  community: __createCommunityLoader(options),
  communityBySlug: __createCommunityBySlugLoader(options),
  communityChannelCount: __createCommunityChannelCountLoader(options),
  communityMemberCount: __createCommunityMemberCountLoader(options),
  communitySettings: __createCommunitySettingsLoader(options),
  directMessageThread: __createDirectMessageThreadLoader(options),
  directMessageParticipants: __createDirectMessageParticipantsLoader(options),
  directMessageSnippet: __createDirectMessageSnippetLoader(options),
  message: __createMessageLoader(options),
  messageReaction: __createReactionLoader(options),
  threadReaction: __createThreadReactionLoader(options),
  reaction: __createSingleReactionLoader(options)
})

export default createLoaders
