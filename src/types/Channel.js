// @flow
const Channel = `
  type Channel {
    id: ID!
    createdAt: Date!
    modifiedAt: Date
    name: String!
    description: String!
    slug: LowercaseString!
    isPrivate: Boolean
    isDefault: Boolean
    isArchived: Boolean
  }

  extend type Query {
    channel(id: ID, channelSlug: LowercaseString, communitySlug: LowercaseString): Channel @cost(complexity: 1)
  }
`

module.exports = Channel
