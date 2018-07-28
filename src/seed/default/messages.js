// @flow
const constants = require('./constants')
const { fromPlainText, toJSON } = require('../../utils/draft.js')
const { DATE, MAX_ID, BRYN_ID, BRIAN_ID } = constants

module.exports = [
  {
    id: '1',
    threadId: 'thread-1',
    attachments: [],
    content: {
      body: JSON.stringify({
        blocks: [
          {
            key: '9u8bg',
            text: '第一条消息出现了!',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {}
          }
        ],
        entityMap: {}
      })
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: MAX_ID,
    timestamp: new Date(DATE)
  },
  {
    id: '2',
    threadId: 'thread-1',
    attachments: [],
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('随之而来的是第二条消息!'))
      )
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: BRYN_ID,
    timestamp: new Date(DATE + 1)
  },
  {
    id: '3',
    threadId: 'thread-1',
    attachments: [],
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('自带表情的一条消息 :scream:'))
      )
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: MAX_ID,
    timestamp: new Date(DATE + 2)
  },
  {
    id: '4',
    threadId: 'thread-1',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('🎉')))
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: BRIAN_ID,
    timestamp: new Date(DATE + 3)
  },

  {
    id: '5',
    threadId: 'thread-2',
    attachments: [],
    content: {
      body: JSON.stringify({
        blocks: [
          {
            key: '9u8bg',
            text: '你好，很高心认识你!',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {}
          }
        ],
        entityMap: {}
      })
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: MAX_ID,
    timestamp: new Date(DATE)
  },
  {
    id: '6',
    threadId: 'thread-2',
    attachments: [],
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('非常荣幸收到你的回复!'))
      )
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: BRYN_ID,
    timestamp: new Date(DATE + 1)
  },
  {
    id: '7',
    threadId: 'thread-2',
    attachments: [],
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('哈哈哈哈，别这么客气 :scream:'))
      )
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: MAX_ID,
    timestamp: new Date(DATE + 2)
  },
  {
    id: '8',
    threadId: 'thread-2',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('🎉')))
    },
    messageType: 'draftjs',
    threadType: 'story',
    senderId: BRIAN_ID,
    timestamp: new Date(DATE + 3)
  },

  // DM Thread
  {
    id: '9',
    threadId: 'dm-1',
    threadType: 'directMessageThread',
    attachments: [],
    content: {
      body: JSON.stringify(
        toJSON(fromPlainText('让我们一起来测试测试吧!'))
      )
    },
    messageType: 'draftjs',
    senderId: MAX_ID,
    timestamp: new Date(DATE)
  },
  {
    id: '10',
    threadId: 'dm-1',
    threadType: 'directMessageThread',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('很短的一条消息')))
    },
    messageType: 'draftjs',
    senderId: BRYN_ID,
    timestamp: new Date(DATE + 50000)
  },
  {
    id: '11',
    threadId: 'dm-1',
    threadType: 'directMessageThread',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('再来一条')))
    },
    messageType: 'draftjs',
    senderId: BRIAN_ID,
    timestamp: new Date(DATE + 100000)
  },
  {
    id: '12',
    threadId: 'dm-1',
    threadType: 'directMessageThread',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('我还要继续发')))
    },
    messageType: 'draftjs',
    senderId: MAX_ID,
    timestamp: new Date(DATE + 200000)
  },
  {
    id: '13',
    threadId: 'dm-1',
    threadType: 'directMessageThread',
    attachments: [],
    content: {
      body: JSON.stringify(toJSON(fromPlainText('最后一条不发了，就此结束')))
    },
    messageType: 'draftjs',
    senderId: BRYN_ID,
    timestamp: new Date(DATE + 300000)
  }
]
