// @flow
import isAdmin from './isAdmin'
import usersGrowth from './usersGrowth'
import communitiesGrowth from './communitiesGrowth'
import channelsGrowth from './channelsGrowth'
import threadsGrowth from './threadsGrowth'
import directMessagesGrowth from './directMessagesGrowth'
import directMessageThreadsGrowth from './directMessageThreadsGrowth'
import threadMessagesGrowth from './directMessagesGrowth'
import topThreads from './topThreads'

module.exports = {
  Query: {
    meta: () => ({})
  },
  Meta: {
    isAdmin,
    usersGrowth,
    communitiesGrowth,
    channelsGrowth,
    threadsGrowth,
    directMessagesGrowth,
    directMessageThreadsGrowth,
    threadMessagesGrowth,
    topThreads
  }
}