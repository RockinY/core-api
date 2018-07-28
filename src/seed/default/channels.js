// @flow
const constants = require('./constants')
const {
  DATE,
  SPECTRUM_COMMUNITY_ID,
  PAYMENTS_COMMUNITY_ID,
  DELETED_COMMUNITY_ID,
  SPECTRUM_GENERAL_CHANNEL_ID,
  SPECTRUM_PRIVATE_CHANNEL_ID,
  PAYMENTS_GENERAL_CHANNEL_ID,
  PAYMENTS_PRIVATE_CHANNEL_ID,
  SPECTRUM_ARCHIVED_CHANNEL_ID,
  SPECTRUM_DELETED_CHANNEL_ID,
  DELETED_COMMUNITY_DELETED_CHANNEL_ID,
  MODERATOR_CREATED_CHANNEL_ID
} = constants

module.exports = [
  {
    id: SPECTRUM_GENERAL_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: '默认',
    description: '默认频道',
    slug: 'general',
    isPrivate: false,
    isDefault: true
  },

  {
    id: SPECTRUM_PRIVATE_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: '私人',
    description: '私人频道',
    slug: 'private',
    isPrivate: true,
    isDefault: false
  },

  {
    id: PAYMENTS_GENERAL_CHANNEL_ID,
    communityId: PAYMENTS_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: '默认',
    description: '默认频道',
    slug: 'general',
    isPrivate: false,
    isDefault: true
  },

  {
    id: PAYMENTS_PRIVATE_CHANNEL_ID,
    communityId: PAYMENTS_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: '私人',
    description: '私人频道',
    slug: 'private',
    isPrivate: true,
    isDefault: false
  },

  {
    id: SPECTRUM_ARCHIVED_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: '已归档',
    description: '测试归档功能',
    slug: 'archived',
    isPrivate: false,
    isDefault: true,
    archivedAt: new Date(DATE)
  },

  {
    id: SPECTRUM_DELETED_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: '已删除',
    description: '测试删除功能',
    slug: 'deleted',
    isPrivate: false,
    isDefault: false,
    deletedAt: new Date(DATE)
  },

  {
    id: DELETED_COMMUNITY_DELETED_CHANNEL_ID,
    communityId: DELETED_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: '已删除',
    description: '测试频道删除',
    slug: 'deleted',
    isPrivate: false,
    isDefault: false,
    deletedAt: new Date(DATE)
  },

  {
    id: MODERATOR_CREATED_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: '成员自建频道',
    description: '社区管理员创建的频道',
    slug: 'moderator-created',
    isPrivate: false,
    isDefault: false
  }
]
