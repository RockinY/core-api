// @flow
import type { DBCommunity, GraphQLContext } from '../../flowTypes'
import UserError from '../../utils/userError'
import {
  getMemberCount,
  getCommunityGrowth
} from '../../models/community'

export default async (
  { id }: DBCommunity,
  _: any,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user

  if (!currentUser) {
    return new UserError('You must be signed in to continue.')
  }

  const { isOwner } = await loaders.userPermissionsInCommunity.load([
    currentUser.id,
    id
  ])

  if (!isOwner) {
    return new UserError(
      'You must be the owner of this community to view analytics.'
    )
  }

  return {
    count: await getMemberCount(id),
    weeklyGrowth: await getCommunityGrowth(
      'usersCommunities',
      'weekly',
      'createdAt',
      id,
      {
        isMember: true
      }
    ),
    monthlyGrowth: await getCommunityGrowth(
      'usersCommunities',
      'monthly',
      'createdAt',
      id,
      {
        isMember: true
      }
    ),
    quarterlyGrowth: await getCommunityGrowth(
      'usersCommunities',
      'quarterly',
      'createdAt',
      id,
      {
        isMember: true
      }
    )
  }
}
