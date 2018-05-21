// @flow
import db from '../db.js'
import type { DBCommunity, DBUser } from '../flowTypes'
import { getRandomDefaultPhoto } from '../utils/fakes'

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

      return community
    })
}
