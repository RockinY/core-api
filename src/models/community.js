// @flow
import db from '../db.js'
import type { DBCommunity, DBUser } from '../flowTypes'
import { getRandomDefaultPhoto } from '../utils/fakes'
import { uploadImage } from '../utils/oss'
import { parseRange } from './utils'
import intersection from 'lodash.intersection'
import type { Timeframe } from './utils'

export const getCommunityById = (id: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(id)
    .run()
    .then(result => {
      if (result && result.deletedAt) return null
      return result
    })
}

export const getCommunities = (
  communityIds: Array<string>
): Promise<Array<DBCommunity>> => {
  return db
    .table('communities')
    .getAll(...communityIds)
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run()
}

export const getCommunitiesBySlug = (
  slugs: Array<string>
): Promise<Array<DBCommunity>> => {
  return db
    .table('communities')
    .getAll(...slugs, { index: 'slug' })
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run()
}

export const getCommunityBySlug = (slug: string): Promise<?DBCommunity> => {
  return db
    .table('communities')
    .getAll(slug, { index: 'slug' })
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run()
    .then(results => {
      if (!results || results.length === 0) return null
      return results[0]
    })
}

export const getCommunitiesByUser = (userId: string): Promise<Array<DBCommunity>> => {
  return (
    db
      .table('usersCommunities')
      // get all the user's communities
      .getAll(userId, { index: 'userId' })
      // only return communities the user is a member of
      .filter({ isMember: true })
      // get the community objects for each community
      .eqJoin('communityId', db.table('communities'))
      // get rid of unnecessary info from the usersCommunities object on the left
      .without({ left: ['id', 'communityId', 'userId', 'createdAt'] })
      // zip the tables
      .zip()
      // ensure we don't return any deleted communities
      .filter(community => db.not(community.hasFields('deletedAt')))
      .run()
  )
}

export const getVisibleCommunitiesByUser = async (evaluatingUserId: string, currentUserId: string) => {
  const evaluatingUserMemberships = await db
    .table('usersCommunities')
    // get all the user's communities
    .getAll(evaluatingUserId, { index: 'userId' })
    // only return communities the user is a member of
    .filter({ isMember: true })
    // get the community objects for each community
    .eqJoin('communityId', db.table('communities'))
    // get rid of unnecessary info from the usersCommunities object on the left
    .without({ left: ['id', 'communityId', 'userId', 'createdAt'] })
    // zip the tables
    .zip()
    // ensure we don't return any deleted communities
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run()

  const currentUserMemberships = await db
    .table('usersCommunities')
    // get all the user's communities
    .getAll(currentUserId, { index: 'userId' })
    // only return communities the user is a member of
    .filter({ isMember: true })
    // get the community objects for each community
    .eqJoin('communityId', db.table('communities'))
    // get rid of unnecessary info from the usersCommunities object on the left
    .without({ left: ['id', 'communityId', 'userId', 'createdAt'] })
    // zip the tables
    .zip()
    // ensure we don't return any deleted communities
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run()

  const evaluatingUserCommunityIds = evaluatingUserMemberships.map(community => community.id)
  const currentUserCommunityIds = currentUserMemberships.map(community => community.id)
  const publicCommunityIds = evaluatingUserMemberships
    .filter(community => !community.isPrivate)
    .map(community => community.id)

  const overlappingMemberships = intersection(evaluatingUserCommunityIds, currentUserCommunityIds)
  const allVisibleCommunityIds = [...publicCommunityIds, ...overlappingMemberships]
  const distinctCommunityIds = allVisibleCommunityIds.filter((x, i, a) => a.indexOf(x) === i)

  return db
    .table('communities')
    .getAll(...distinctCommunityIds)
    .run()
}

export const getPublicCommunitiesByUser = async (userId: string) => {
  return db
    .table('usersCommunities')
    // get all the user's communities
    .getAll(userId, { index: 'userId' })
    // only return communities the user is a member of
    .filter({ isMember: true })
    // get the community objects for each community
    .eqJoin('communityId', db.table('communities'))
    // only return public community ids
    .filter(row => row('right')('isPrivate').eq(false))
    // get rid of unnecessary info from the usersCommunities object on the left
    .without({ left: ['id', 'communityId', 'userId', 'createdAt'] })
    // zip the tables
    .zip()
    // ensure we don't return any deleted communities
    .filter(community => db.not(community.hasFields('deletedAt')))
    .run()
}

export const getCommunitiesChannelCounts = (communityIds: Array<string>) => {
  return db
    .table('channels')
    .getAll(...communityIds, { index: 'communityId' })
    .filter(channel => db.not(channel.hasFields('deletedAt')))
    .group('communityId')
    .count()
    .run()
}

export const getCommunityMetaData = (communityId: string): Promise<Array<number>> => {
  const getChannelCount = db
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .filter(channel => db.not(channel.hasFields('deletedAt')))
    .count()
    .run()

  const getMemberCount = db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isBlocked: false, isMember: true })
    .count()
    .run()

  return Promise.all([getChannelCount, getMemberCount])
}

export const getMemberCount = (communityId: string): Promise<number> => {
  return db
    .table('usersCommunities')
    .getAll(communityId, { index: 'communityId' })
    .filter({ isBlocked: false, isMember: true })
    .count()
    .run()
}

export const getCommunitiesMemberCounts = (communityIds: Array<string>) => {
  return db
    .table('usersCommunities')
    .getAll(...communityIds, { index: 'communityId' })
    .filter({ isBlocked: false, isMember: true })
    .group('communityId')
    .count()
    .run()
}

export type CreateCommunityInput = {
  input: {
    name: string,
    slug: string,
    description: string,
    website: string,
    file: Object,
    coverFile: Object
  }
}

export type EditCommunityInput = {
  input: {
    name: string,
    slug: string,
    description: string,
    website: string,
    file: Object,
    coverFile: Object,
    communityId: string,
  },
}

export const createCommunity = ({ input }: CreateCommunityInput, user: DBUser): Promise<DBCommunity> => {
  const { name, slug, description, website, file, coverFile } = input

  return db
    .table('communities')
    .insert(
      {
        createdAt: new Date(),
        name,
        description,
        website,
        profilePhoto: null,
        coverPhoto: null,
        slug,
        modifiedAt: null,
        creatorId: user.id,
        administratorEmail: user.email,
        stripeCustomerId: null
      },
      { returnChanges: true }
    )
    .run()
    .then(result => result.changes[0].new_val)
    .then(community => {
      // TODO: Add event task queue
      // TODO: Send welcome email to creator
      // TODO: Email admin about the community

      // if no file was uploaded, update the community with new string values
      if (!file && !coverFile) {
        const { coverPhoto, profilePhoto } = getRandomDefaultPhoto()
        return db
          .table('communities')
          .get(community.id)
          .update(
            { ...community, profilePhoto, coverPhoto },
            { returnChanges: 'always' }
          )
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

      if (file || coverFile) {
        if (file && !coverFile) {
          const { coverPhoto } = getRandomDefaultPhoto()
          return uploadImage(file, 'community', community.id)
            .then(profilePhoto => {
              return db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    ...community,
                    profilePhoto,
                    coverPhoto
                  },
                  { returnChanges: 'always' }
                )
                .run()
                .then(result => {
                  if (result.replaced === 1) {
                    return result.changes[0].new_val
                  }

                  if (result.unchanged === 1) {
                    return result.changes[0].old_val
                  }
                })
            })
            .catch(err => {
              console.error(err)
            })
        } else if (!file && coverFile) {
          const { profilePhoto } = getRandomDefaultPhoto()
          return uploadImage(coverFile, 'communities', community.id)
            .then(coverPhoto => {
              return db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    ...community,
                    coverPhoto,
                    profilePhoto
                  },
                  { returnChanges: 'always' }
                )
                .run()
                .then(result => {
                  if (result.replaced === 1) {
                    return result.changes[0].new_val
                  }

                  if (result.unchanged === 1) {
                    return result.changes[0].old_val
                  }
                })
            })
            .catch(err => {
              console.error(err)
            })
        } else if (file && coverFile) {
          const uploadFile = file => {
            return uploadImage(file, 'communities', community.id).catch(err => {
              console.error(err)
            })
          }

          const uploadCoverFile = coverFile => {
            return uploadImage(coverFile, 'communities', community.id).catch(
              err => {
                console.error(err)
              }
            )
          }

          return Promise.all([
            uploadFile(file),
            uploadCoverFile(coverFile)
          ]).then(([profilePhoto, coverPhoto]) => {
            return (
              db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    ...community,
                    coverPhoto,
                    profilePhoto
                  },
                  { returnChanges: 'always' }
                )
                .run()
                // return the resulting community with the profilePhoto set
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
            )
          })
        }
      }
    })
}

export const editCommunity = ({ input }: EditCommunityInput, userId: string): Promise<DBCommunity> => {
  const { name, slug, description, website, file, coverFile, communityId } = input

  return db
    .table('communities')
    .get(communityId)
    .run()
    .then(result => {
      return Object.assign({}, result, {
        name,
        slug,
        description,
        website,
        modifiedAt: new Date()
      })
    })
    .then(community => {
      // if no file was uploaded, update the community with new string values
      if (!file && !coverFile) {
        return db
          .table('communities')
          .get(communityId)
          .update({ ...community }, { returnChanges: 'always' })
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
          })
      }

      if (file || coverFile) {
        if (file && !coverFile) {
          return uploadImage(file, 'communities', community.id).then(
            profilePhoto => {
              // update the community with the profilePhoto
              return (
                db
                  .table('communities')
                  .get(community.id)
                  .update(
                    {
                      ...community,
                      profilePhoto
                    },
                    { returnChanges: 'always' }
                  )
                  .run()
                  // return the resulting community with the profilePhoto set
                  .then(result => {
                    // if an update happened
                    if (result.replaced === 1) {
                      return result.changes[0].new_val
                    }

                    // an update was triggered from the client, but no data was changed
                    if (result.unchanged === 1) {
                      return result.changes[0].old_val
                    }
                  })
              )
            }
          )
        } else if (!file && coverFile) {
          return uploadImage(coverFile, 'communities', community.id).then(
            coverPhoto => {
              // update the community with the profilePhoto
              return (
                db
                  .table('communities')
                  .get(community.id)
                  .update(
                    {
                      ...community,
                      coverPhoto
                    },
                    { returnChanges: 'always' }
                  )
                  .run()
                  // return the resulting community with the profilePhoto set
                  .then(result => {
                    // if an update happened
                    if (result.replaced === 1) {
                      return result.changes[0].new_val
                    }

                    // an update was triggered from the client, but no data was changed
                    if (result.unchanged === 1) {
                      return result.changes[0].old_val
                    }
                  })
              )
            }
          )
        } else if (file && coverFile) {
          const uploadFile = file => {
            return uploadImage(file, 'communities', community.id)
          }

          const uploadCoverFile = coverFile => {
            return uploadImage(coverFile, 'communities', community.id)
          }

          return Promise.all([
            uploadFile(file),
            uploadCoverFile(coverFile)
          ]).then(([profilePhoto, coverPhoto]) => {
            return (
              db
                .table('communities')
                .get(community.id)
                .update(
                  {
                    ...community,
                    coverPhoto,
                    profilePhoto
                  },
                  { returnChanges: 'always' }
                )
                .run()
                // return the resulting community with the profilePhoto set
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
            )
          })
        }
      }
    })
}

export const deleteCommunity = (communityId: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update(
      {
        deletedBy: userId,
        deletedAt: new Date(),
        slug: db.uuid()
      },
      {
        returnChanges: 'always',
        nonAtomic: true
      }
    )
    .run()
}

export const setPinnedThreadInCommunity = (communityId: string, value: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update(
      {
        pinnedThreadId: value
      },
      { returnChanges: 'always' }
    )
    .run()
    .then(result => {
      return result.changes[0].new_val
    })
}

export const userIsMemberOfAnyChannelInCommunity = (communityId: string, userId: string): Promise<Boolean> => {
  return db('spectrum')
    .table('channels')
    .getAll(communityId, { index: 'communityId' })
    .eqJoin('id', db.table('usersChannels'), { index: 'channelId' })
    .zip()
    .filter({ userId })
    .pluck('isMember')
    .run()
    .then(channels => channels.some(channel => channel.isMember))
}

export const getRecentCommunities = (): Array<DBCommunity> => {
  return db
    .table('communities')
    .orderBy({ index: db.desc('createdAt') })
    .filter(community => db.not(community.hasFields('deletedAt')))
    .limit(100)
    .run()
}

export const getThreadCount = (communityId: string) => {
  return db
    .table('threads')
    .getAll(communityId, { index: 'communityId' })
    .filter(thread => db.not(thread.hasFields('deletedAt')))
    .count()
    .run()
}

export const getCommunityGrowth = async (
  table: string,
  range: Timeframe,
  field: string,
  communityId: string,
  filter?: mixed
) => {
  const { current, previous } = parseRange(range)
  const currentPeriodCount = await db
    .table(table)
    .getAll(communityId, { index: 'communityId' })
    .filter(db.row(field).during(db.now().sub(current), db.now()))
    .filter(filter || '')
    .count()
    .run()

  const prevPeriodCount = await db
    .table(table)
    .getAll(communityId, { index: 'communityId' })
    .filter(db.row(field).during(db.now().sub(previous), db.now().sub(current)))
    .filter(filter || '')
    .count()
    .run()

  const rate = (await (currentPeriodCount - prevPeriodCount)) / prevPeriodCount
  return {
    currentPeriodCount,
    prevPeriodCount,
    growth: Math.round(rate * 100)
  }
}

export const setCommunityPendingAdministratorEmail = (communityId: string, email: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update({
      pendingAdministratorEmail: email
    })
    .run()
    .then(async () => {
      return getCommunityById(communityId)
    })
}

export const updateCommunityAdministratorEmail = (communityId: string, email: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update({
      administratorEmail: email,
      pendingAdministratorEmail: db.literal()
    })
    .run()
    .then(async () => {
      return getCommunityById(communityId)
    })
}

export const resetCommunityAdministratorEmail = (communityId: string) => {
  return db
    .table('communities')
    .get(communityId)
    .update({
      administratorEmail: null,
      pendingAdministratorEmail: db.literal()
    })
    .run()
}

export const setStripeCustomerId = (communityId: string, stripeCustomerId: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update(
      {
        stripeCustomerId
      },
      {
        returnChanges: 'always'
      }
    )
    .run()
    .then(result => result.changes[0].new_val || result.changes[0].old_val)
}

export const disablePaidFeatureFlags = (communityId: string, userId: string): Promise<DBCommunity> => {
  return db
    .table('communities')
    .get(communityId)
    .update({
      analyticsEnabled: false,
      prioritySupportEnabled: false
    })
    .run()
    .then(async () => {
      return getCommunityById(communityId)
    })
}

export const updateCommunityPaidFeature = (
  communityId: string,
  feature: string,
  value: boolean,
  userId: string
): Promise<DBCommunity> => {
  const obj = { [feature]: value }
  return db
    .table('communities')
    .get(communityId)
    .update(obj, { returnChanges: 'always' })
    .run()
    .then(result => {
      if (result && result.changes.length > 0) {
        return result.changes[0].new_val || result.changes[0].old_val
      }
      return { id: communityId }
    })
}
