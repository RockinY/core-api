// @flow
const { fromPlainText, toJSON } = require('../../utils/draft.js')
const constants = require('./constants')
const {
  DATE,
  BRIAN_ID,
  MAX_ID,
  BRYN_ID,
  SPECTRUM_GENERAL_CHANNEL_ID,
  SPECTRUM_PRIVATE_CHANNEL_ID,
  DELETED_COMMUNITY_DELETED_CHANNEL_ID,
  MODERATOR_CREATED_CHANNEL_ID,
  DELETED_COMMUNITY_ID,
  SPECTRUM_COMMUNITY_ID,
  SPECTRUM_ARCHIVED_CHANNEL_ID
} = constants

module.exports = [
  {
    id: 'thread-1',
    createdAt: new Date(DATE),
    creatorId: BRIAN_ID,
    channelId: SPECTRUM_GENERAL_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: '你会因为年龄而结婚吗？',
      body: JSON.stringify(
        toJSON(fromPlainText('年纪大了你还有当时年少对爱情的追求执着吗'))
      )
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE),
        content: {
          title: '你会因为年龄而结婚吗？',
          body: JSON.stringify(
            toJSON(fromPlainText('年纪大了你还有当时年少对爱情的追求执着吗'))
          )
        }
      }
    ],
    modifiedAt: new Date(DATE),
    lastActive: new Date(DATE)
  },
  {
    id: 'thread-2',
    createdAt: new Date(DATE + 1),
    creatorId: MAX_ID,
    channelId: SPECTRUM_GENERAL_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: '吃瓜！吴亦凡：虎扑不搞体育来搞我，看来真的很闲',
      body: JSON.stringify(
        toJSON(fromPlainText('总感觉是来炒热度的，西瓜太糊了'))
      )
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE + 1),
        content: {
          title: '吃瓜！吴亦凡：虎扑不搞体育来搞我，看来真的很闲',
          body: JSON.stringify(
            toJSON(fromPlainText('总感觉是来炒热度的，西瓜太糊了'))
          )
        }
      }
    ],
    modifiedAt: new Date(DATE + 1),
    lastActive: new Date(DATE + 1)
  },
  {
    id: 'thread-3',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: SPECTRUM_GENERAL_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: '长春长生高俊芳是不是现实版的高小琴？',
      body: JSON.stringify(
        toJSON(fromPlainText('两人有相同点都是女强人，都是经过白手起家通过非法交易获得巨额财产，都是颇有姿色的女人，财产都是上百亿。社会影响极大。最后都因为违法犯罪被抓了起来。'))
      )
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: '长春长生高俊芳是不是现实版的高小琴？',
          body: JSON.stringify(
            toJSON(fromPlainText('两人有相同点都是女强人，都是经过白手起家通过非法交易获得巨额财产，都是颇有姿色的女人，财产都是上百亿。社会影响极大。最后都因为违法犯罪被抓了起来。'))
          )
        }
      }
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2)
  },

  {
    id: 'thread-4',
    createdAt: new Date(DATE),
    creatorId: BRIAN_ID,
    channelId: SPECTRUM_PRIVATE_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: '南京酷猿信息技术有限公司成立了！',
      body: JSON.stringify(
        toJSON(fromPlainText('好激动好激动啊'))
      )
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE),
        content: {
          title: '南京酷猿信息技术有限公司成立了！',
          body: JSON.stringify(
            toJSON(fromPlainText('好激动好激动啊'))
          )
        }
      }
    ],
    modifiedAt: new Date(DATE),
    lastActive: new Date(DATE)
  },
  {
    id: 'thread-5',
    createdAt: new Date(DATE + 1),
    creatorId: MAX_ID,
    channelId: SPECTRUM_PRIVATE_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      )
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE + 1),
        content: {
          title: 'Another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          )
        }
      }
    ],
    modifiedAt: new Date(DATE + 1),
    lastActive: new Date(DATE + 1)
  },
  {
    id: 'thread-6',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: SPECTRUM_PRIVATE_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: '一粉顶十黑，扒一扒粉丝那些令人窒息的操作，谁家脑残比较强？',
      body: JSON.stringify(
        toJSON(fromPlainText('嗯嗯，本帖只是娱乐而已，所有言论讨论的谁家的脑残粉，都只是脑残粉而已不概括所有粉，所以粉丝别自己代入角色，暂时不对明星评论（为什么暂时呢？因为我说的是脑残粉，如果粉丝非要说我是在说说明星，那么就别怪我真的说明星了）'))
      )
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: '有在广东珠三角一起创业的吗？小本生意，非常小',
          body: JSON.stringify(
            toJSON(fromPlainText('做的是健康压榨花生油，小作坊模式。'))
          )
        }
      }
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2)
  },
  {
    id: 'thread-7',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: DELETED_COMMUNITY_DELETED_CHANNEL_ID,
    communityId: DELETED_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: '有那么一份工作，6k起，你不来看看？',
      body: JSON.stringify(
        toJSON(fromPlainText('有能耐的你就来，想挣钱的你也来，想挑战自我的来，想为了以后也来，只要你想为自己拼搏的都来。'))
      )
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: '有那么一份工作，6k起，你不来看看？',
          body: JSON.stringify(
            toJSON(fromPlainText('有能耐的你就来，想挣钱的你也来，想挑战自我的来，想为了以后也来，只要你想为自己拼搏的都来。'))
          )
        }
      }
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
    deletedAt: new Date(DATE + 3)
  },
  {
    id: 'thread-8',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: SPECTRUM_ARCHIVED_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: '我觉得是时候改变了！',
      body: JSON.stringify(
        toJSON(fromPlainText('一个月拿着少得可怜的工资 上着奔波的班，想改变 却不知道从哪里开始'))
      )
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: '我觉得是时候改变了！',
          body: JSON.stringify(
            toJSON(fromPlainText('一个月拿着少得可怜的工资 上着奔波的班，想改变 却不知道从哪里开始'))
          )
        }
      }
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2)
  },
  {
    id: 'thread-9',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: SPECTRUM_GENERAL_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: true,
    type: 'DRAFTJS',
    content: {
      title: '30岁的人群都说说你的生活工作现状',
      body: JSON.stringify(
        toJSON(fromPlainText('30岁的人群都说说你的生活工作现状，未来生活工作的打算；假如时间可以倒流的话你将这样规划你的人生？大家可以畅所欲言，说出你的想法。 '))
      )
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: '30岁的人群都说说你的生活工作现状',
          body: JSON.stringify(
            toJSON(fromPlainText('30岁的人群都说说你的生活工作现状，未来生活工作的打算；假如时间可以倒流的话你将这样规划你的人生？大家可以畅所欲言，说出你的想法。 '))
          )
        }
      }
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2)
  },

  {
    id: 'thread-10',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: MODERATOR_CREATED_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: '如果不考虑薪水、面子和最严，你最想做的工作是什么？',
      body: JSON.stringify(
        toJSON(fromPlainText('在豆瓣看到一个很有趣的帖子：“如果不考虑薪水、面子和最严，你最想做的工作是什么？”'))
      )
    },
    attachments: [],
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: '如果不考虑薪水、面子和最严，你最想做的工作是什么？',
          body: JSON.stringify(
            toJSON(fromPlainText('在豆瓣看到一个很有趣的帖子：“如果不考虑薪水、面子和最严，你最想做的工作是什么？”'))
          )
        }
      }
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2)
  }
]
