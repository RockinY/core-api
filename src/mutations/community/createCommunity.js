// @flow
import type { GraphQLContext } from '../../flowTypes'
import type { CreateCommunityInput } from '../../models/community'
import UserError from '../../utils/userError'
import { communitySlugIsBlacklisted, isAuthedResolver as requireAuth } from '../../utils/permissions'
import { getCommunitiesBySlug, createCommunity } from '../../models/community'
import { createOwnerInCommunity } from '../../models/usersCommunities'
import { createGeneralChannel } from '../../models/channel'
import { createOwnerInChannel } from '../../models/usersChannels'
import { isProUser } from '../../utils/permissions'

export default requireAuth(
  async (_: any, args: CreateCommunityInput, { user }: GraphQLContext) => {

    if (!args.input.slug || args.input.slug.length === 0) {
      // TODO: track queue
      return new UserError(
        'Communities must have a valid url so people can find it!'
      )
    }

    // replace any non alpha-num characters to prevent bad community slugs
    // (/[\W_]/g, "-") => replace non-alphanum with hyphens
    // (/-{2,}/g, '-') => replace multiple hyphens in a row with one hyphen
    const sanitizedSlug = args.input.slug
      .replace(/[\W_]/g, '-')
      .replace(/-{2,}/g, '-')
    const sanitizedArgs = Object.assign(
      {},
      {
        ...args,
        input: {
          ...args.input,
          slug: sanitizedSlug
        }
      }
    )

    if (communitySlugIsBlacklisted(sanitizedSlug)) {
      // TODO: track queue
      return new UserError(
        `This url is already taken - feel free to change it if
        you're set on the name ${args.input.name}!`
      )
    }

    // get communities with the input slug to check for duplicates
    const communities = await getCommunitiesBySlug([sanitizedSlug])

    if (communities.length > 0) {
      // TODO: track queue
      return new UserError('A community with this slug already exists.')
    }

    // check user permissions
    const userIsPro = await isProUser(user)
    if (!userIsPro && args.input.isPrivate) {
      return new UserError('Permission denied.')
    }

    // all checks passed
    const community = await createCommunity(sanitizedArgs, user)

    // create a new relationship with the community
    const communityRelationship = await createOwnerInCommunity(
      community.id,
      user.id
    )

    // create a default 'general' channel
    const generalChannel = await createGeneralChannel(community.id, user.id)

    // create a new relationship with the general channel
    const generalChannelRelationship = createOwnerInChannel(
      generalChannel.id,
      user.id
    )

    return Promise.all([
      communityRelationship,
      generalChannelRelationship
    ]).then(() => community)
  }
)
