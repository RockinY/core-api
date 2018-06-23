// @flow
const Thread = `
  type ThreadMessagesConnection {
    pageInfo: PageInfo!
    edges: [ThreadMessageEdge!]
  }

  type ThreadMessageEdge {
    cursor: String!
    node: Message!
  }

  type ThreadContent {
    title: String
    body: String
    media: String
  }

  type Edit {
    timestamp: Date!
    content: ThreadContent!
  }

  enum ThreadType {
    DRAFTJS
    TEXT
  }

  type Attachment {
    attachmentType: String
    data: String
  }

  type Thread {
    id: ID!
    createdAt: Date!
    modifiedAt: Date
    channel: Channel!
    community: Community! @cost(complexity: 1)
    isPublished: Boolean!
    content: ThreadContent!
    isLocked: Boolean
    isAuthor: Boolean
    receiveNotifications: Boolean @cost(complexity: 1)
    lastActive: Date
    type: ThreadType
    edits: [Edit!]
    participants: [User] @cost(complexity: 1)
    messageConnection(first: Int, after: String, last: Int, before: String): ThreadMessagesConnection! @cost(complexity: 1, multiplier: "first")
    messageCount: Int @cost(complexity: 1)
    author: ThreadParticipant! @cost(complexity: 2)
    attachments: [Attachment]
    watercooler: Boolean
    currentUserLastSeen: Date @cost(complexity: 1)
  }

  extend type Query {
    thread(id: ID!): Thread
  }

  input AttachmentInput {
    attachmentType: String
    data: String
  }

  input ThreadContentInput {
    title: String
    body: String
  }

  input EditThreadInput {
    threadId: ID!
    content: ThreadContentInput!
    attachments: [AttachmentInput]
    filesToUpload: [Upload]
  }

  input ThreadInput {
    channelId: ID!
    communityId: ID!
    type: ThreadType
    content: ThreadContentInput!
    attachments: [AttachmentInput]
    filesToUpload: [Upload]
  }

  extend type Mutation {
    publishThread(thread: ThreadInput!): Thread
    editThread(input: EditThreadInput!): Thread
    setThreadLock(threadId: ID!, value: Boolean!): Thread
    toggleThreadNotifications(threadId: ID!): Thread
    deleteThread(threadId: ID!): Boolean
    moveThread(threadId: ID!, channelId: ID!): Thread
  }

  extend type Subscription {
    threadUpdated(channelIds: [String!]): Thread
  }
`

module.exports = Thread
