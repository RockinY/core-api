// @flow
const constants = require('./constants')
const {
  MAX_ID,
  BRIAN_ID,
  BRYN_ID,
  QUIET_USER_ID,
  BLOCKED_USER_ID,
  PREVIOUS_MEMBER_USER_ID,
  CHANNEL_MODERATOR_USER_ID,
  COMMUNITY_MODERATOR_USER_ID,
  DATE
} = constants

module.exports = [
  {
    id: MAX_ID,
    name: '曹言',
    description:
      '我依旧深信时间是良药虽苦口但有效',
    website: 'https://mxstbr.com',
    username: 'caoyan',
    profilePhoto: 'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/avatars/avatar1.jpeg',
    coverPhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover1.jpg',
    email: 'caoyan@corran.cn',
    providerId: '2451223458',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE)
  },
  {
    id: BRIAN_ID,
    name: '李子',
    description: '尽人事，听天命，更多的时候是需要有一颗能够接纳失去的心。',
    website: 'https://brianlovin.com',
    username: 'liyuwei',
    profilePhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/avatars/avatar2.jpg',
    coverPhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover2.jpg',
    email: 'frank@corran.cn',
    providerId: '465068802',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE)
  },
  {
    id: BRYN_ID,
    name: 'Giorgio - 乔治',
    description: '总是向你索取却不曾谢谢你，直到长大以后才懂得你不容易。',
    website: 'https://bryn.io',
    username: 'giorgio',
    profilePhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/avatars/avatar3.jpeg',
    coverPhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover3.jpg',
    email: 'giorgio@corran.cn',
    providerId: '17106008',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE)
  },
  {
    id: QUIET_USER_ID,
    name: 'change黄皇兴',
    description: "我是个游客，还没有加入任何社区",
    website: '',
    username: 'quiet-user',
    profilePhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/avatars/avatar4.jpeg',
    coverPhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover4.jpg',
    email: 'hi@quietuser.com',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE)
  },
  {
    id: BLOCKED_USER_ID,
    name: '李乾坤David',
    description: '我被社区屏蔽了',
    website: '',
    username: 'blocked-user',
    profilePhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/avatars/avatar5.jpg',
    coverPhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover5.jpg',
    email: 'hi@blockeduser.com',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE)
  },
  {
    id: PREVIOUS_MEMBER_USER_ID,
    name: '陆鼎铭',
    description: '只有拼命的将嘴角拉起，才不会将眼底那该死的落寞遮住',
    website: '',
    username: 'previous-user',
    profilePhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/avatars/avatar6.jpg',
    coverPhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover6.jpg',
    email: 'hi@previousboy.io',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE)
  },
  {
    id: CHANNEL_MODERATOR_USER_ID,
    name: '高路遥',
    description: '与其给我山盟海誓 不如陪我走过每一个春夏秋冬',
    website: '',
    username: 'channel-moderator-user',
    profilePhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/avatars/avatar7.jpg',
    coverPhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover7.jpg',
    email: 'hi@channelmoderatorboy.io',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE)
  },
  {
    id: COMMUNITY_MODERATOR_USER_ID,
    name: '转身浅笑',
    description: '我把我的心都花出去了，竟然忘了留下一点点来疼自己',
    website: '',
    username: 'community-moderator-user',
    profilePhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/avatars/avatar8.jpg',
    coverPhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover8.jpg',
    email: 'hi@communitymoderatorboy.io',
    createdAt: new Date(DATE),
    lastSeen: new Date(DATE)
  }
]
