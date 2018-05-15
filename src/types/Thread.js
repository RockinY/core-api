// @flow
const Thread = `
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
    isPublished: Boolean!
    content: ThreadContent!
    isLocked: Boolean
    isAuthor: Boolean
    lastActive: Date
    type: ThreadType
    edits: [Edit!]
    attachments: [Attachment]
    watercooler: Boolean
  }

  extend type Query {
    thread(id: ID!): Thread
  }
`

module.exports = Thread
