// @flow
const DirectMessageThread = `
  type DirectMessagesConnection {
    pageInfo: PageInfo!
    edges: [DirectMessageEdge!]
  }

  type DirectMessageEdge {
    cursor: String!
    node: Message!
  }

  type ParticipantInfo {
    id: ID!
    name: String
    username: String
    profilePhoto: String
    lastActive: Date
    lastSeen: Date
    userId: ID!
    isOnline: Boolean
  }

  type DirectMessageThread {
    id: ID!
    messageConnection(first: Int = 20, after: String): DirectMessagesConnection! @cost(complexity: 1, multiplier: "first")
    participants: [ParticipantInfo]! @cost(complexity: 1)
    snippet: String! @cost(complexity: 2)
    threadLastActive: Date!
  }
  
  extend type Query {
    directMessageThread(id: ID!): DirectMessageThread
  }
`

module.exports = DirectMessageThread
