// @flow
import db from '../db.js'
import type { DBCommunitySettings, DBCommunity } from '../flowTypes'
import { getCommunityById } from './community'
import shortid from 'shortid'
import axios from 'axios'
import { decryptString } from '../utils/encryption'

const defaultSettings = {
  brandedLogin: {
    isEnabled: false,
    message: null
  },
  slackSettings: {
    connectedAt: null,
    connectedBy: null,
    teamName: null,
    teamId: null,
    scope: null,
    token: null,
    invitesSentAt: null,
    invitesMemberCount: null,
    invitesCustomMessage: null
  },
  joinSettings: {
    tokenJoinEnabled: false,
    token: null
  }
}

// prettier-ignore
export const getOrCreateCommunitySettings = async (communityId: string): Promise<DBCommunitySettings> => {
  const settings = await db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .run()

  if (!settings || settings.length === 0) {
    return db
      .table('communitySettings')
      .insert(
        {
          ...defaultSettings,
          communityId
        },
        { returnChanges: true }
      )
      .run()
      .then(results => results.changes[0].new_val)
  }

  return settings[0]
}

// prettier-ignore
export const getCommunitySettings = (id: string): Promise<DBCommunitySettings> => {
  return db
    .table('communitySettings')
    .getAll(id, { index: 'communityId' })
    .run()
    .then(data => {
      if (!data || data.length === 0) {
        return defaultSettings
      }
      return data[0]
    })
}

// prettier-ignore
export const getCommunitiesSettings = (communityIds: Array<string>): Promise<?DBCommunitySettings> => {
  return db
    .table('communitySettings')
    .getAll(...communityIds, { index: 'communityId' })
    .run()
    .then(data => {
      if (!data || data.length === 0) {
        return Array.from({ length: communityIds.length }, (_, index) => ({
          ...defaultSettings,
          communityId: communityIds[index]
        }))
      }

      if (data.length === communityIds.length) {
        return data.map(
          (rec, index) =>
            rec || {
              ...defaultSettings,
              communityId: communityIds[index]
            }
        )
      }

      if (data.length < communityIds.length) {
        return communityIds.map(communityId => {
          const record = data.find(o => o.communityId === communityId)
          if (record) return record
          return {
            ...defaultSettings,
            communityId
          }
        })
      }

      if (data.length > communityIds.length) {
        return communityIds.map(communityId => {
          const record = data.find(o => o.communityId === communityId)
          if (record) return record
          return {
            ...defaultSettings,
            communityId
          }
        })
      }
    })
}

// prettier-ignore
export const createCommunitySettings = (communityId: string): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .insert({
      communityId,
      ...defaultSettings
    })
    .run()
    .then(async () => getCommunityById(communityId))
}

// prettier-ignore
export const enableCommunityBrandedLogin = (communityId: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      brandedLogin: {
        isEnabled: true
      }
    })
    .run()
    .then(async () => {
      return getCommunityById(communityId)
    })
}

// prettier-ignore
export const disableCommunityBrandedLogin = (communityId: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      brandedLogin: {
        isEnabled: false
      }
    })
    .run()
    .then(async () => {
      return getCommunityById(communityId)
    })
}

// prettier-ignore
export const updateCommunityBrandedLoginMessage = (communityId: string, message: ?string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      brandedLogin: {
        message: message
      }
    })
    .run()
    .then(async () => {
      return getCommunityById(communityId)
    })
}

export const enableCommunityTokenJoin = (
  communityId: string,
  userId: string
) => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      joinSettings: {
        tokenJoinEnabled: true,
        token: shortid.generate()
      }
    })
    .run()
    .then(async () => {
      return getCommunityById(communityId)
    })
}

export const disableCommunityTokenJoin = (
  communityId: string,
  userId: string
) => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      joinSettings: {
        tokenJoinEnabled: false,
        token: null
      }
    })
    .run()
    .then(async () => {
      return getCommunityById(communityId)
    })
}

export const resetCommunityJoinToken = (
  communityId: string,
  userId: string
) => {
  return db
    .table('communitySettings')
    .getAll(communityId, { index: 'communityId' })
    .update({
      joinSettings: {
        token: shortid.generate()
      }
    })
    .run()
    .then(async () => {
      return getCommunityById(communityId)
    })
}
