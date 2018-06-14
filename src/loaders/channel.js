// @flow
import {
  getChannels,
  getChannelsThreadCounts,
  getChannelsMemberCounts
} from '../models/channel'
import { getChannelsSettings } from '../models/channelSettings'
import { getPendingUsersInChannels } from '../models/usersChannels'
import createLoader from './createLoader'

export const __createChannelLoader = createLoader(channels => {
  return getChannels(channels)
})

export const __createChannelThreadCountLoader = createLoader(
  channels => getChannelsThreadCounts(channels),
  'group'
)

export const __createChannelMemberCountLoader = createLoader(
  channels => getChannelsMemberCounts(channels),
  'group'
)

export const __createChannelPendingMembersLoader = createLoader(
  channels => getPendingUsersInChannels(channels),
  'group'
)

export const __createChannelSettingsLoader = createLoader(
  channelIds => getChannelsSettings(channelIds),
  key => key.channelId
)

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  )
}
