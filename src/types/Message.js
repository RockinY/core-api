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

  type ReactionData {
		count: Int!
		hasReacted: Boolean
	}

  type Message {
    id: ID!
		timestamp: Date!
		thread: Thread
		content: MessageContent!
    author: ThreadParticipant! @cost(complexity: 2)
    reactions: ReactionData @cost(complexity: 1)
		messageType: MessageTypes!
    parent: Message
  }

  extend type Query {
    message(id: ID!): Message
		getMediaMessagesForThread(threadId: ID!): [Message]
  }

  input MessageContentInput {
    body: String
  }

  input MessageInput {
    threadId: ID!
    threadType: ThreadTypes!
    messageType: MessageTypes!
    content: MessageContentInput!
    parentId: String
    file: Upload
  }

  extend type Mutation {
    addMessage(message: MessageInput!): Message
    deleteMessage(id: ID!): Boolean
  }

  extend type Subscription {
		messageAdded(thread: ID!): Message
	}
`

module.exports = Message
