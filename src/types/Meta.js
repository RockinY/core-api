// @flow
const Meta = /* GraphQL */ `
  type UsersGrowthData {
    count: Int
    dau: Int
    wau: Int
    mau: Int
    weeklyGrowth: GrowthDataCounts
    monthlyGrowth: GrowthDataCounts
    quarterlyGrowth: GrowthDataCounts
  }

  type Meta {
    isAdmin: Boolean
    usersGrowth: UsersGrowthData
    communitiesGrowth: GrowthData
    channelsGrowth: GrowthData
    threadsGrowth: GrowthData
    directMessageThreadsGrowth: GrowthData
    threadMessagesGrowth: GrowthData
    directMessagesGrowth: GrowthData
    topThreads: [Thread]
  }

  extend type Query {
    meta: Meta
  }

  input SaveUserCommunityPermissionsInput {
    isOwner: Boolean
    isMember: Boolean
    isBlocked: Boolean
    isModerator: Boolean
    receiveNotifications: Boolean
    id: ID!
  }

  extend type Mutation {
    saveUserCommunityPermissions(input: SaveUserCommunityPermissionsInput!): User
  }
`

module.exports = Meta