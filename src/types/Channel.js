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
    channelPermissions: ChannelPermissions! @cost(complexity: 1)
    communityPermissions: CommunityPermissions!
    community: Community! @cost(complexity: 1)
    threadConnection(first: Int = 10, after: String): ChannelThreadsConnection! @cost(complexity: 1, multiplier: "first")
    memberConnection(first: Int = 10, after: String): ChannelMembersConnection! @cost(complexity: 1, multiplier: "first")
    memberCount: Int!
    metaData: ChannelMetaData @cost(complexity: 1)
    pendingUsers: [User] @cost(complexity: 3)
    blockedUsers: [User] @cost(complexity: 3)
    moderators: [User] @cost(complexity: 3)
    owners: [User] @cost(complexity: 3)
    joinSettings: JoinSettings 
    slackSettings: ChannelSlackSettings
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
