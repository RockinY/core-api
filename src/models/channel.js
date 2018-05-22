// @flow
import db from '../db'
import type { DBChannel } from '../flowTypes'

type GetChannelByIdArgs = {
  id: string,
};

type GetChannelBySlugArgs = {
  slug: string,
  communitySlug: string,
};

export type GetChannelArgs = GetChannelByIdArgs | GetChannelBySlugArgs;

const channelsByIdsQuery = (...channelIds: string[]) => {
  return db
    .table('channels')
    .getAll(...channelIds)
    .filter(channel => db.not(channel.hasFields('deletedAt')))
}

export const getChannelBySlug = (
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

export const getChannelById = async (id: string) => {
  return (await channelsByIdsQuery(id).run())[0] || null
}

export const getChannels = (channelIds: Array<string>): Promise<Array<DBChannel>> => {
  return channelsByIdsQuery(...channelIds).run()
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

export const createChannel = ({ input }: CreateChannelInput, userId: string): Promise<DBChannel> => {
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

export const createGeneralChannel = (communityId: string, userId: string): Promise<DBChannel> => {
  return createChannel(
    {
      input: {
        name: 'General',
        slug: 'general',
        description: 'General Chatter',
        communityId,
        isPrivate: false,
        isDefault: true
      }
    },
    userId
  )
}
