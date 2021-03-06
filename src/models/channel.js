// @flow
import db from '../db'
import type { DBChannel } from '../flowTypes'

const channelsByCommunitiesQuery = (...communityIds: string[]) => {
  return db
    .table('channels')
    .getAll(...communityIds, { index: 'communityId' })
    .filter(channel => db.not(channel.hasFields('deletedAt')))
}

const threadsByChannelsQuery = (...channelIds: string[]) => {
  return channelsByIdsQuery(...channelIds)
    .eqJoin('id', db.table('threads'), { index: 'channelId' })
    .map(row => row('right'))
    .filter(thread => db.not(thread.hasFields('deletedAt')))
}

const membersByChannelsQuery = (...channelIds: string[]) => {
  return channelsByIdsQuery(...channelIds)
    .eqJoin('id', db.table('usersChannels'), { index: 'channelId' })
    .map(row => row('right'))
    .filter({ isBlocked: false, isPending: false, isMember: true })
}

const getChannelsByCommunity = (communityId: string): Promise<Array<DBChannel>> => {
  return channelsByCommunitiesQuery(communityId).run()
}

const getPublicChannelsByCommunity = (communityId: string): Promise<Array<string>> => {
  return channelsByCommunitiesQuery(communityId)
    .filter({ isPrivate: false })
    .map(c => c('id'))
    .run()
}

const getChannelsByUserAndCommunity = async (communityId: string, userId: string): Promise<Array<string>> => {
  const channels = await getChannelsByCommunity(communityId)

  const channelIds = channels.map(c => c.id)
  const publicChannels = channels.filter(c => !c.isPrivate).map(c => c.id)

  const usersChannels = await db
    .table('usersChannels')
    .getAll(userId, { index: 'userId' })
    .filter(usersChannel =>
      db.expr(channelIds).contains(usersChannel('channelId'))
    )
    .filter({ isMember: true })
    .run()

  const usersChannelsIds = usersChannels.map(c => c.channelId)
  const allPossibleChannels = [...publicChannels, ...usersChannelsIds]
  const distinct = allPossibleChannels.filter((x, i, a) => a.indexOf(x) === i)
  return distinct
}

const getChannelsByUser = (userId: string): Promise<Array<DBChannel>> => {
  return (
    db
      .table('usersChannels')
      // get all the user's channels
      .getAll(userId, { index: 'userId' })
      // only return channels where the user is a member
      .filter({ isMember: true })
      // get the channel objects for each channel
      .eqJoin('channelId', db.table('channels'))
      // get rid of unnecessary info from the usersChannels object on the left
      .without({ left: ['id', 'channelId', 'userId', 'createdAt'] })
      // zip the tables
      .zip()
      // ensure we don't return any deleted channels
      .filter(channel => db.not(channel.hasFields('deletedAt')))
      .run()
  )
}

type GetChannelByIdArgs = {
  id: string,
};

type GetChannelBySlugArgs = {
  channelSlug: string,
  communitySlug: string,
};

export type GetChannelArgs = GetChannelByIdArgs | GetChannelBySlugArgs;

const channelsByIdsQuery = (...channelIds: string[]) => {
  return db
    .table('channels')
    .getAll(...channelIds)
    .filter(channel => db.not(channel.hasFields('deletedAt')))
}

const getChannelBySlug = (
  channelSlug: string,
  communitySlug: string
): Promise<DBChannel> => {
  return db
    .table('channels')
    .filter(channel => {
      return channel('slug')
        .eq(channelSlug)
        .and(db.not(channel.hasFields('deletedAt')))
    })
    .eqJoin('communityId', db.table('communities'))
    .filter({ right: { slug: communitySlug } })
    .run()
    .then(result => {
      if (result && result[0]) {
        return result[0].left
      }
      return null
    })
}

const getChannelById = async (id: string) => {
  return (await channelsByIdsQuery(id).run())[0] || null
}

const getChannels = (channelIds: Array<string>): Promise<Array<DBChannel>> => {
  return channelsByIdsQuery(...channelIds).run()
}

const getChannelMetaData = async (channelId: string): Promise<Array<number>> => {
  const getThreadCount = threadsByChannelsQuery(channelId)
    .count()
    .run()

  const getMemberCount = membersByChannelsQuery(channelId)
    .count()
    .run()

  return Promise.all([getThreadCount, getMemberCount])
}

type GroupedCount = {
  group: string,
  reduction: number,
}

const getChannelsThreadCounts = (channelIds: Array<string>): Promise<Array<GroupedCount>> => {
  return threadsByChannelsQuery(...channelIds)
    .group('channelId')
    .count()
    .run()
}

const getChannelsMemberCounts = (channelIds: Array<string>): Promise<Array<GroupedCount>> => {
  return membersByChannelsQuery(...channelIds)
    .group('channelId')
    .count()
    .run()
}

export type CreateChannelInput = {
  input: {
    communityId: string,
    name: string,
    description: string,
    slug: string,
    isPrivate: boolean,
    isDefault: boolean
  }
}

export type EditChannelInput = {
  input: {
    channelId: string,
    name: string,
    description: string,
    slug: string,
    isPrivate: Boolean,
  },
}

const createChannel = ({ input }: CreateChannelInput, userId: string): Promise<DBChannel> => {
  const { communityId, name, slug, description, isPrivate, isDefault } = input

  return db
    .table('channels')
    .insert(
      {
        communityId,
        createdAt: new Date(),
        name,
        description,
        slug,
        isPrivate,
        isDefault: isDefault === true
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(channel => {
      // TODO: add track queue

      if (!channel.isPrivate) {
        // TODO: send channel notification
      }

      return channel
    })
}

const createGeneralChannel = (communityId: string, userId: string): Promise<DBChannel> => {
  return createChannel(
    {
      input: {
        name: '默认',
        slug: 'general',
        description: '默认频道',
        communityId,
        isPrivate: false,
        isDefault: true
      }
    },
    userId
  )
}

const editChannel = async ({ input }: EditChannelInput, userId: string): Promise<DBChannel> => {
  const { name, slug, description, isPrivate, channelId } = input

  const channelRecord = await db
    .table('channels')
    .get(channelId)
    .run()
    .then(result => {
      return Object.assign({}, result, {
        name,
        description,
        slug,
        isPrivate
      })
    })

  return db
    .table('channels')
    .get(channelId)
    .update({ ...channelRecord }, { returnChanges: 'always' })
    .run()
    .then(result => {
      // if an update happened
      if (result.replaced === 1) {
        return result.changes[0].new_val
      }

      // an update was triggered from the client, but no data was changed
      if (result.unchanged === 1) {
        return result.changes[0].old_val
      }

      return null
    })
}

const deleteChannel = (channelId: string, userId: string): Promise<Boolean> => {
  return db
    .table('channels')
    .get(channelId)
    .update(
      {
        deletedBy: userId,
        deletedAt: new Date(),
        slug: db.uuid()
      },
      {
        returnChanges: true,
        nonAtomic: true
      }
    )
    .run()
}

const getChannelMemberCount = (channelId: string): number => {
  return db
    .table('channels')
    .get(channelId)('members')
    .count()
    .run()
}

const archiveChannel = (channelId: string, userId: string): Promise<DBChannel> => {
  return db
    .table('channels')
    .get(channelId)
    .update({ archivedAt: new Date() }, { returnChanges: 'always' })
    .run()
    .then(result => {
      return result.changes[0].new_val || result.changes[0].old_val
    })
}

const restoreChannel = (channelId: string, userId: string): Promise<DBChannel> => {
  return db
    .table('channels')
    .get(channelId)
    .update({ archivedAt: db.literal() }, { returnChanges: 'always' })
    .run()
    .then(result => {
      return result.changes[0].new_val || result.changes[0].old_val
    })
}

const archiveAllPrivateChannels = async (communityId: string, userId: string) => {
  const channels = await db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isPrivate: true })
    .run()

  if (!channels || channels.length === 0) return

  const archivePromise = db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isPrivate: true })
    .update({ archivedAt: new Date() })
    .run()

  return Promise.all([archivePromise])
}

module.exports = {
  getChannelBySlug,
  getChannelById,
  getChannelMetaData,
  getChannelsByUser,
  getChannelsByCommunity,
  getPublicChannelsByCommunity,
  getChannelsByUserAndCommunity,
  createChannel,
  createGeneralChannel,
  editChannel,
  deleteChannel,
  getChannelMemberCount,
  getChannelsMemberCounts,
  getChannelsThreadCounts,
  getChannels,
  archiveChannel,
  restoreChannel,
  archiveAllPrivateChannels,
  __forQueryTests: {
    channelsByCommunitiesQuery,
    channelsByIdsQuery,
    threadsByChannelsQuery,
    membersByChannelsQuery
  }
}
