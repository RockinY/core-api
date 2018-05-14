// @flow
import {
  getCommunities,
  getCommunitiesBySlug
} from '../models/community'
import createLoader from './createLoader'

export const __createCommunityLoader = createLoader(communities => {
  return getCommunities(communities)
})

export const __createCommunityBySlugLoader = createLoader(
  communities => getCommunitiesBySlug(communities),
  'slug'
)
