// @flow
const Meta = /* GraphQL */ `
  type UsersGrowthData {
    count: Int,
    dau: Int,
    wau: Int,
    mau: Int,
    weeklyGrowth: GrowthDataCounts,
    monthlyGrowth: GrowthDataCounts,
    quarterlyGrowth: GrowthDataCounts
  }

  type Meta {
    isAdmin: Boolean,
    usersGrowth: UsersGrowthData,
    communitiesGrowth: GrowthData,
    channelsGrowth: GrowthData,
    threadsGrowth: GrowthData,
    directMessageThreadsGrowth: GrowthData,
    threadMessageGrowth: GrowthData,
    directMessagesGrowth: GrowthData,
    topThreads: [Thread]
  }

  extend type Query {
    meta: Meta
  }
`