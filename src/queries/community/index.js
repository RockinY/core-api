// @flow
import community from './rootCommunity'
import communities from './rootCommunities'
import topCommunities from './rootTopCommunities'
import recentCommunities from './rootRecentCommunities'

import communityPermissions from './communityPermissions'
import channelConnection from './channelConnection'
import members from './members'
import pinnedThread from './pinnedThread'
import threadConnection from './threadConnection'
import metaData from './metaData'
import memberGrowth from './memberGrowth'
import conversationGrowth from './conversationGrowth'
import topMembers from './topMembers'
import topAndNewThreads from './topAndNewThreads'
import watercooler from './watercooler'
import brandedLogin from './brandedLogin'
import joinSettings from './joinSettings'

module.exports = {
  Query: {
    community,
    communities,
    topCommunities,
    recentCommunities
  },
  Community: {
    communityPermissions,
    channelConnection,
    members,
    pinnedThread,
    threadConnection,
    metaData,
    memberGrowth,
    conversationGrowth,
    topMembers,
    topAndNewThreads,
    watercooler,
    brandedLogin,
    joinSettings
  }
}
