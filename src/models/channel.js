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
