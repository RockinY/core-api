// @flow
const Message = `
  enum MessageTypes {
    text
    media
    draftjs
  }

  enum ThreadTypes {
    story
    directMessageThread
  }

  type MessageContent {
    body: String!
  }

  type Message {
    id: ID!
    timestamp: Date!
    thread: Thread
    content: MessageContent
    messageType: MessageTypes!
    parent: Message
  }

  extend type Query {
    message(id: ID!): Message
  }
`

module.exports = Message
