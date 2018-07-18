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
  }

  extend type Query {
    channel(id: ID, channelSlug: LowercaseString, communitySlug: LowercaseString): Channel @cost(complexity: 1)
  }

  input ArchiveChannelInput {
    channelId: ID!
  }

  input RestoreChannelInput {
    channelID: ID!
  }

  input JoinChannelWithTokenInput {
    communitySlug: LowercaseString!
    channelSlug: LowercaseString!
    token: String!
  }

  input EnableChannelJoinTokenInput {
    id: ID!
  }

  input DisableChannelJoinTokenInput {
    id: ID!
  }

  input ResetChannelJoinTokenInput {
    id: ID!
  }

  input UnblockUserInput {
    channelId: ID!
    userId: ID!
  }

  input EditChannelInput {
    name: String
    slug: LowercaseString
    description: String
    isPrivate: Boolean
    channelId: ID!
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
    editChannel(input: EditChannelInput!): Channel
    joinChannelWithToken(input: JoinChannelWithTokenInput!): Channel
    toggleChannelSubscription(channelId: ID!): Channel
    deleteChannel(channelId: ID!): Boolean
    toggleChannelNotifications(channelId: ID!): Channel
    unblockUser(input: UnblockUserInput!): Channel
    archiveChannel(input: ArchiveChannelInput!): Channel
    restoreChannel(input: RestoreChannelInput!): Channel
    enableChannelTokenJoin(input: EnableChannelJoinTokenInput!): Channel
    disableChannelTokenJoin(input: DisableChannelJoinTokenInput!): Channel
    resetChannelJoinToken(input: ResetChannelJoinTokenInput!): Channel
  }
`

module.exports = Channel
