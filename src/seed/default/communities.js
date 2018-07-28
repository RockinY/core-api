// @flow
const constants = require('./constants')
const {
  DATE,
  SPECTRUM_COMMUNITY_ID,
  PAYMENTS_COMMUNITY_ID,
  DELETED_COMMUNITY_ID,
  PRIVATE_COMMUNITY_ID
} = constants

module.exports = [
  {
    id: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    isPrivate: false,
    name: '云社官方',
    description: '一个自由和谐有趣的社区',
    website: 'https://yunshe.fun',
    profilePhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/communities/comm1.png',
    coverPhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover18.jpg',
    slug: 'yunshe'
  },
  {
    id: PAYMENTS_COMMUNITY_ID,
    createdAt: new Date(DATE),
    isPrivate: false,
    name: '南京酷猿信息技术有限公司',
    description: '全蓝鲸最厉害的互联网公司',
    website: 'https://corran.cn',
    profilePhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/communities/comm2.png',
    coverPhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover2.jpg',
    slug: 'payments'
  },
  {
    id: DELETED_COMMUNITY_ID,
    createdAt: new Date(DATE),
    deletedAt: new Date(DATE),
    isPrivate: false,
    name: '已被删除',
    description: '不会再出现的',
    website: 'https://yunshe.fun',
    profilePhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/communities/comm2.png',
    coverPhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover2.jpg',
    slug: 'deleted'
  },
  {
    id: PRIVATE_COMMUNITY_ID,
    createdAt: new Date(DATE),
    isPrivate: true,
    name: '秘密社区',
    description: '请注意，这是私人社区',
    website: 'https://yunshe.fun',
    profilePhoto:
      'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/communities/comm3.png',
    coverPhoto:
    'https://xlabsample.oss-cn-hangzhou.aliyuncs.com/covers/cover20.jpg',
    slug: 'private',
  },
]
