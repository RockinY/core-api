// @flow
const Channel = `
  type ChannelMembersConnection {
    pageInfo: PageInfo!
    edges: [ChannelMemberEdge!]
  }

  type ChannelMemberEdge {
    cursor: String!
    node: User!
  }

  type ChannelThreadsConnection {
    pageInfo: PageInfo!
    edges: [ChannelThreadEdge!]
  }

  type ChannelThreadEdge {
    cursor: String!
    node: Thread!
  }

  type ChannelMetaData {
    threads: Int
    members: Int
  }

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

  input CreateChannelInput {
    name: String!
    slug: LowercaseString!
    description: String
    communityId: ID!
    isPrivate: Boolean
    isDefault: Boolean
  }

  extend type Mutation {
    createChannel(input: CreateChannelInput!): Channel
  }
`

module.exports = Channel
