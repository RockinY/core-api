// @flow
const constants = require('./constants')
const {
  DATE,
  MAX_ID,
  BRYN_ID,
  BRIAN_ID,
  PREVIOUS_MEMBER_USER_ID,
  BLOCKED_USER_ID,
  CHANNEL_MODERATOR_USER_ID,
  COMMUNITY_MODERATOR_USER_ID,
  SPECTRUM_COMMUNITY_ID,
  PAYMENTS_COMMUNITY_ID
} = constants

module.exports = [
  {
    id: '1',
    createdAt: new Date(DATE),
    userId: MAX_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isOwner: true,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 100
  },
  {
    id: '2',
    createdAt: new Date(DATE),
    userId: BRIAN_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isOwner: false,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 100
  },
  {
    id: '3',
    createdAt: new Date(DATE),
    userId: BRYN_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isOwner: false,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 100
  },
  {
    id: '4',
    createdAt: new Date(DATE),
    userId: BLOCKED_USER_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isOwner: false,
    isModerator: false,
    isMember: false,
    isBlocked: true,
    receiveNotifications: true,
    reputation: 100
  },
  {
    id: '6',
    createdAt: new Date(DATE),
    userId: PREVIOUS_MEMBER_USER_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isOwner: false,
    isModerator: false,
    isMember: false,
    isBlocked: false,
    receiveNotifications: false,
    reputation: 100
  },

  {
    id: '7',
    createdAt: new Date(DATE),
    userId: MAX_ID,
    communityId: PAYMENTS_COMMUNITY_ID,
    isOwner: true,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 100
  },
  {
    id: '8',
    createdAt: new Date(DATE),
    userId: BRIAN_ID,
    communityId: PAYMENTS_COMMUNITY_ID,
    isOwner: false,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 100
  },
  {
    id: '9',
    createdAt: new Date(DATE),
    userId: BRYN_ID,
    communityId: PAYMENTS_COMMUNITY_ID,
    isOwner: false,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 100
  },
  {
    id: '10',
    createdAt: new Date(DATE),
    userId: CHANNEL_MODERATOR_USER_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isOwner: false,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 100
  },
  {
    id: '11',
    createdAt: new Date(DATE),
    userId: CHANNEL_MODERATOR_USER_ID,
    communityId: PAYMENTS_COMMUNITY_ID,
    isOwner: false,
    isModerator: false,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 100
  },
  {
    id: '12',
    createdAt: new Date(DATE),
    userId: COMMUNITY_MODERATOR_USER_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isOwner: false,
    isModerator: true,
    isMember: false,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 100
  },
  {
    id: '13',
    createdAt: new Date(DATE),
    userId: COMMUNITY_MODERATOR_USER_ID,
    communityId: PAYMENTS_COMMUNITY_ID,
    isOwner: false,
    isModerator: true,
    isMember: true,
    isBlocked: false,
    receiveNotifications: true,
    reputation: 100
  }
]