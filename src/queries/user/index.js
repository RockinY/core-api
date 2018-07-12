// @flow
import user from './rootUser'
import currentUser from './rootCurrentUser'

import email from './email'
import coverPhoto from './coverPhoto'
import profilePhoto from './profilePhoto'
import everything from './everything'
import communityConnection from './communityConnection'
import channelConnection from './channelConnection'
import directMessageThreadsConnection from './directMessageThreadsConnection'
import threadConnection from './threadConnection'
import threadCount from './threadCount'
import settings from './settings'
import totalReputation from './totalReputation'
import githubProfile from './githubProfile'
import isPro from './isPro'

module.exports = {
  Query: {
    user,
    currentUser
  },
  User: {
    email,
    coverPhoto,
    profilePhoto,
    everything,
    communityConnection,
    channelConnection,
    directMessageThreadsConnection,
    threadConnection,
    threadCount,
    settings,
    totalReputation,
    githubProfile,
    isPro
  }
}
