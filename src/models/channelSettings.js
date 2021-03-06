// @flow
import db from '../db'
import type { DBChannelSettings, DBChannel } from '../flowTypes'
import { getChannelById } from './channel'
import shortid from 'shortid'

const defaultSettings = {
  joinSettings: {
    tokenJoinEnabled: false,
    message: null
  },
  slackSettings: {
    botLinks: {
      threadCreated: null
    }
  }
}

// prettier-ignore
export const getOrCreateChannelSettings = async (channelId: string): Promise<DBChannelSettings> => {
  const settings = await db
    .table('channelSettings')
    .getAll(channelId, { index: 'channelId' })
    .run()

  if (!settings || settings.length === 0) {
    return db
      .table('channelSettings')
      .insert(
        {
          ...defaultSettings,
          channelId
        },
        { returnChanges: true }
      )
      .run()
      .then(results => results.changes[0].new_val)
  }

  return settings[0]
}

// prettier-ignore
export const getChannelsSettings = (channelIds: Array<string>): Promise<?DBChannelSettings> => {
  return db
    .table('channelSettings')
    .getAll(...channelIds, { index: 'channelId' })
    .run()
    .then(data => {
      if (!data || data.length === 0) {
        return Array.from({ length: channelIds.length }, (_, index) => ({
          ...defaultSettings,
          channelId: channelIds[index]
        }))
      }

      return data.map(
        (rec, index) =>
          rec || {
            ...defaultSettings,
            channelId: channelIds[index]
          }
      )
    })
}

export const enableChannelTokenJoin = (channelId: string, userId: string) => {
  return db
    .table('channelSettings')
    .getAll(channelId, { index: 'channelId' })
    .update({
      joinSettings: {
        tokenJoinEnabled: true,
        token: shortid.generate()
      }
    })
    .run()
    .then(async () => {
      return getChannelById(channelId)
    })
}

export const disableChannelTokenJoin = (channelId: string, userId: string) => {
  return db
    .table('channelSettings')
    .getAll(channelId, { index: 'channelId' })
    .update({
      joinSettings: {
        tokenJoinEnabled: false,
        token: null
      }
    })
    .run()
    .then(async () => {
      return getChannelById(channelId)
    })
}

export const resetChannelJoinToken = (channelId: string, userId: string) => {
  return db
    .table('channelSettings')
    .getAll(channelId, { index: 'channelId' })
    .update({
      joinSettings: {
        token: shortid.generate()
      }
    })
    .run()
    .then(async () => {
      return getChannelById(channelId)
    })
}

type UpdateInput = {
  channelId: string,
  slackChannelId: ?string,
  eventType: 'threadCreated',
};

// prettier-ignore
export const updateChannelSlackBotLinks = async ({ channelId, slackChannelId, eventType }: UpdateInput, userId: string): Promise<DBChannel> => {
  const settings: DBChannelSettings = await getOrCreateChannelSettings(
    channelId
  )

  let newSettings
  if (!settings.slackSettings) {
    settings.slackSettings = {
      botLinks: {
        [eventType]:
          slackChannelId && slackChannelId.length > 0 ? slackChannelId : null
      }
    }
    newSettings = Object.assign({}, settings)
  } else {
    newSettings = Object.assign({}, settings, {
      slackSettings: {
        botLinks: {
          [eventType]:
            slackChannelId && slackChannelId.length > 0 ? slackChannelId : null
        }
      }
    })
  }

  return db
    .table('channelSettings')
    .getAll(channelId, { index: 'channelId' })
    .update({
      ...newSettings
    })
    .run()
    .then(async () => {
      return getChannelById(channelId)
    })
}
